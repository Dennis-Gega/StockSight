#!/usr/bin/env python3
import urllib.request
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
import os

# CSV will live at repo root: StockSight/data/sp500_prices.csv
DATA_PATH = "data/sp500_prices.csv"

# First day you care about (change if needed)
INITIAL_START_DATE = "2024-11-21"  # Nov 21, 2024

def get_sp500_tickers():
    """Grab the current S&P 500 ticker list from Wikipedia."""
    url = "https://en.m.wikipedia.org/wiki/List_of_S%26P_500_companies"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/605.1.15 (KHTML, like Gecko) "
                "Version/14.0 Safari/605.1.15"
            )
        },
    )
    html = urllib.request.urlopen(req).read()
    df = pd.read_html(html, attrs={"id": "constituents"}, index_col="Symbol")[0]
    return df.index.tolist()   # list of ticker symbols

def load_existing_data():
    """Load existing CSV if it exists, else return None."""
    try:
        df = pd.read_csv(DATA_PATH, parse_dates=["Date"])
        return df
    except FileNotFoundError:
        return None

def main():
    tickers = get_sp500_tickers()
    existing = load_existing_data()

    if existing is None:
        # First ever run: pull from fixed start date
        start_date = INITIAL_START_DATE
        print(f"No existing CSV. Downloading from {start_date} onward.")
    else:
        last_date = existing["Date"].max().date()
        start_date = (last_date + timedelta(days=1)).isoformat()
        today = datetime.utcnow().date()

        if start_date > today.isoformat():
            print("No new dates to download. Data already up to date.")
            return

        print(f"Existing data up to {last_date}. Downloading from {start_date} onward.")

    all_data = []

    for ticker in tickers:
        print(f"Downloading {ticker}...")
        hist = yf.download(
            ticker,
            start=start_date,
            interval="1d",
            auto_adjust=False,
            progress=False,
            threads=True,
        )

        if hist.empty:
            continue

        # Flatten MultiIndex columns if needed
        if isinstance(hist.columns, pd.MultiIndex):
            hist.columns = hist.columns.get_level_values(0)

        hist = hist.reset_index()  # 'Date' becomes a column
        hist["Ticker"] = ticker

        if "Adj Close" in hist.columns:
            hist = hist.drop(columns=["Adj Close"])

        all_data.append(hist)

    if not all_data:
        print("No new data downloaded.")
        return

    new_df = pd.concat(all_data, ignore_index=True)

    if existing is not None:
        combined = pd.concat([existing, new_df], ignore_index=True)
        combined = combined.drop_duplicates(subset=["Date", "Ticker"]).sort_values(
            ["Date", "Ticker"]
        )
    else:
        combined = new_df.sort_values(["Date", "Ticker"])

    os.makedirs("data", exist_ok=True)
    combined.to_csv(DATA_PATH, index=False)
    print(f"Saved {len(new_df)} new rows. Total rows: {len(combined)}")

if __name__ == "__main__":
    main()
