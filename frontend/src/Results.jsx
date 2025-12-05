// src/Results.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchIndicators } from "./lib/api.js";
import { toggleFavorite, isFavorite } from "./lib/favorites.js";

import Loader from "./components/Loader.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import IndicatorToggles from "./components/IndicatorToggles.jsx";
import PriceChart from "./components/PriceChart.jsx";
import StatCards from "./components/StatCards.jsx";

export default function Results() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const ticker = (params.get("ticker") || "AAPL").toUpperCase();
  const range = params.get("range") || "1mo";
  const interval = params.get("interval") || "1d";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [toggles, setToggles] = useState({ rsi: true, macd: true, bb: true });

  // NEW: favorite state for current ticker
  const [isFav, setIsFav] = useState(false);

  // When ticker changes, read favorite status from localStorage
  useEffect(() => {
    setIsFav(isFavorite(ticker));
  }, [ticker]);

  // Fetch indicators when inputs change
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await fetchIndicators({ ticker, range, interval });
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) {
          const msg =
            e?.message && e.message !== "Failed to load indicator data"
              ? e.message
              : `Could not load data for ticker “${ticker}”.`;
          const qs = new URLSearchParams({ error: msg }).toString();
          navigate(`/?${qs}`, { replace: true });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ticker, range, interval, navigate]);

  const inner = data?.data;
  const prices = inner?.prices || [];
  const indicators = inner?.indicators;

  const latestRsi = indicators?.rsi?.at?.(-1);
  const latestMacd = indicators?.macd?.macd?.at?.(-1);
  const signal = inner?.signal;

  const chartData = useMemo(() => {
    if (!prices.length) return [];
    return prices.map((p, i) => ({
      time: new Date(p.t).getTime(),
      close: p.c ?? null,
      bb_upper: indicators?.bb?.upper?.[i] ?? null,
      bb_lower: indicators?.bb?.lower?.[i] ?? null,
    }));
  }, [prices, indicators]);

  if (loading) return <Loader />;
  if (!inner) return <ErrorMessage>No data returned for {ticker}.</ErrorMessage>;

  // NEW: handler for the star / favorite button
  function handleToggleFavorite() {
    const { isNowFavorite } = toggleFavorite(ticker);
    setIsFav(isNowFavorite);
  }

  return (
    <section className="mx-auto max-w-6xl py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium"
      >
        ← Back to Home
      </button>

      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase 
                        text-indigo-500 dark:text-indigo-200">
            Analysis overview
          </p>

          {/* Title row: Ticker + Yahoo link + Favorite button */}
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-semibold
                           text-slate-900 dark:text-slate-50">
              {ticker}{" "}
              <a
                href={`https://finance.yahoo.com/quote/${ticker}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-300 hover:underline text-lg font-normal"
              >
                (Yahoo Finance)
              </a>
            </h2>

            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-pressed={isFav}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors
                ${
                  isFav
                    ? "border-amber-400 bg-amber-500/10 text-amber-400"
                    : "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                }`}
            >
              <span>{isFav ? "★" : "☆"}</span>
              <span>{isFav ? "Favorited" : "Add to favorites"}</span>
            </button>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-200">
            Range: {range} • Interval: {interval}
          </p>
        </div>

        <IndicatorToggles state={toggles} onChange={setToggles} />
      </header>

      <StatCards
        summary={{
          signal,
          rsi: latestRsi,
          macd: latestMacd,
        }}
        showTooltips={true}
      />

      <PriceChart data={chartData} showBB={toggles.bb} />
    </section>
  );
}
