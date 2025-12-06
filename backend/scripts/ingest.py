import os
import datetime as dt
import yfinance as yf
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

load_dotenv()
DB_URL = os.getenv("DATABASE_URL")

def fetch_hist(ticker, period="3mo", interval="1d"):
    t = yf.Ticker(ticker)
    df = t.history(period=period, interval=interval, auto_adjust=False)
    df = df.reset_index()  # has 'Date' or 'Datetime' depending on interval
    if 'Date' in df.columns:
        df = df.rename(columns={'Date':'ts'})
    elif 'Datetime' in df.columns:
        df = df.rename(columns={'Datetime':'ts'})
    df = df.rename(columns=str.lower)
    return df[['ts','open','high','low','close','volume']]

def insert_prices(conn, ticker, df, interval):
    sql = """
    INSERT INTO price_history (ticker, ts, "open", high, low, "close", volume, interval)
    VALUES %s
    ON CONFLICT (ticker, ts, interval) DO NOTHING;
    """
    rows = [(ticker, r.ts.to_pydatetime(), float(r.open), float(r.high), float(r.low),
             float(r.close), int(r.volume) if r.volume==r.volume else 0, interval)
            for _, r in df.iterrows()]
    with conn.cursor() as cur:
        execute_values(cur, sql, rows, page_size=1000)
    conn.commit()

def upsert_ticker(conn, ticker):
    with conn.cursor() as cur:
        cur.execute("""INSERT INTO tickers(ticker) VALUES (%s)
                       ON CONFLICT (ticker) DO NOTHING;""", (ticker,))
    conn.commit()

def main():
    tickers = ["AAPL","MSFT","NVDA","AMZN","GOOGL"]
    conn = psycopg2.connect(DB_URL)
    for sym in tickers:
        upsert_ticker(conn, sym)
        df = fetch_hist(sym, period="6mo", interval="1d")
        insert_prices(conn, sym, df, "1d")
        print("Loaded", sym, len(df), "rows")
    conn.close()

if __name__ == "__main__":
    main()
