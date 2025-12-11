import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchIndicators } from "./lib/api.js";
import {
  getFavorites,
  addFavorite,
  removeFavorite
} from "./lib/favorites.js";

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
  const [toggles, setToggles] = useState({ bb: true });

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const list = getFavorites();
    setFavorites(list);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await fetchIndicators({ ticker, range, interval });

        if (!cancelled) {
          if (!res.ok) {
            const qs = new URLSearchParams({
              error: res.error || `No data returned for ${ticker}`
            }).toString();
            navigate(`/?${qs}`, { replace: true });
            return;
          }

          setData(res);
        }
      } catch (e) {
        if (!cancelled) {
          const qs = new URLSearchParams({
            error: `No data returned for ${ticker}`
          }).toString();
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

    const rows = prices.map((p, i) => ({
      time: new Date(p.t).getTime(),
      close: p.c ?? null,
      bb_upper: indicators?.bb?.upper?.[i] ?? null,
      bb_lower: indicators?.bb?.lower?.[i] ?? null
    }));

    const cutoffDate = new Date(rows[rows.length - 1].time);

    if (range === "1mo") cutoffDate.setMonth(cutoffDate.getMonth() - 1);
    else if (range === "3mo") cutoffDate.setMonth(cutoffDate.getMonth() - 3);
    else if (range === "6mo") cutoffDate.setMonth(cutoffDate.getMonth() - 6);
    else if (range === "1y")
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
    else cutoffDate.setMonth(cutoffDate.getMonth() - 3);

    const cutoff = cutoffDate.getTime();
    return rows.filter((r) => r.time >= cutoff);
  }, [prices, indicators, range]);

  const isFavorite = favorites.includes(ticker);

  function handleToggleFavorite() {
    if (isFavorite) {
      removeFavorite(ticker);
      setFavorites(favorites.filter((t) => t !== ticker));
    } else {
      addFavorite(ticker);
      setFavorites([...favorites, ticker]);
    }
  }

  if (loading) return <Loader />;
  if (!inner)
    return <ErrorMessage>No data returned for {ticker}.</ErrorMessage>;

  return (
    <section className="mx-auto max-w-6xl py-8 space-y-6 text-slate-900 dark:text-slate-100">
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
      >
        ← Back to Home
      </button>

      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-indigo-600 dark:text-indigo-300">
            ANALYSIS OVERVIEW
          </p>

          <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
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

          <p className="text-sm text-slate-600 dark:text-slate-300">
            Range: {range} • Interval: {interval}
          </p>

          <button
            type="button"
            onClick={handleToggleFavorite}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-700 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-200 bg-white/60 dark:bg-slate-900/60 hover:bg-indigo-50 dark:hover:bg-indigo-900/40"
          >
            <span className="text-base">
              {isFavorite ? "★" : "☆"}
            </span>
            <span>{isFavorite ? "Favorited" : "Add to favorites"}</span>
          </button>
        </div>

        <IndicatorToggles state={toggles} onChange={setToggles} />
      </header>

      <StatCards
        summary={{
          signal,
          rsi: latestRsi,
          macd: latestMacd
        }}
        showTooltips={true}
      />

      <PriceChart data={chartData} showBB={toggles.bb} />
    </section>
  );
}
