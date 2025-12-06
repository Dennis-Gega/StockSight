// src/Favorites.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchIndicators } from "./lib/api.js";
import { getFavorites } from "./lib/favorites.js";
import Loader from "./components/Loader.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";

function safeNum(x) {
  return Number.isFinite(x) ? x : null;
}

// Simple company name mapping
const COMPANY_NAMES = {
  AAPL: "Apple Inc.",
  MSFT: "Microsoft Corporation",
  GOOGL: "Alphabet Inc.",
  AMZN: "Amazon.com Inc.",
  TSLA: "Tesla Inc.",
  NVDA: "NVIDIA Corporation",
  META: "Meta Platforms Inc.",
};

function getCompanyName(ticker) {
  return COMPANY_NAMES[ticker] || "Saved ticker";
}

// FINAL COLOR PALETTE (matches Results page exactly)
function getSignalClasses(signalRaw) {
  const s = (signalRaw || "").toLowerCase();

  if (s === "buy") {
    return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
  }
  if (s === "hold") {
    return "bg-amber-500/20 text-amber-300 border border-amber-500/40";
  }
  if (s === "sell") {
    return "bg-rose-500/20 text-rose-300 border border-rose-500/40";
  }

  return "bg-slate-600/20 text-slate-200 border border-slate-500/40";
}

export default function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState([]);
  const [error, setError] = useState("");

  // Load favorites initially
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  // Fetch summary data
  useEffect(() => {
    async function loadSummaries() {
      if (!favorites.length) {
        setSummaries([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const out = [];

        for (const ticker of favorites) {
          try {
            const res = await fetchIndicators({
              ticker,
              range: "1mo",
              interval: "1d",
            });

            const inner = res?.data;
            const payload = inner?.data || inner;

            const indicators = payload?.indicators || {};
            const signal = payload?.signal || payload?.summary?.signal;

            const latestRsi = indicators?.rsi?.at?.(-1);
            const latestMacd = indicators?.macd?.macd?.at?.(-1);

            out.push({
              ticker,
              signal: signal || "—",
              rsi: safeNum(latestRsi),
              macd: safeNum(latestMacd),
            });
          } catch {
            out.push({
              ticker,
              signal: "Error",
              rsi: null,
              macd: null,
            });
          }
        }

        setSummaries(out);
      } catch {
        setError("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    }

    loadSummaries();
  }, [favorites]);

  // Open results page
  const handleViewDetails = (ticker) => {
    navigate(`/results?ticker=${encodeURIComponent(ticker)}&range=1mo&interval=1d`);
  };

  const handleEmptyState = () => navigate("/");

  if (loading && !summaries.length) {
    return (
      <section className="mx-auto max-w-4xl py-10">
        <Loader />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl py-8 space-y-6">
      {/* HEADER */}
      <header>
        <p className="text-xs font-semibold tracking-[0.3em] text-indigo-500 uppercase dark:text-indigo-300">
          Favorites
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Saved tickers
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Click any favorite to jump straight into a fresh analysis.
        </p>
      </header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* EMPTY STATE */}
      {!favorites.length && !loading && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 p-6 text-center">
          <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
            You haven’t added any favorites yet.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Search for a ticker on the home page and tap the ★ button to save it.
          </p>

          <button
            onClick={handleEmptyState}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            ← Back to Home
          </button>
        </div>
      )}

      {/* FAVORITES LIST */}
      {!!summaries.length && (
        <div className="grid gap-4 sm:grid-cols-2">
          {summaries.map((item) => {
            const company = getCompanyName(item.ticker);
            const pillClass = getSignalClasses(item.signal);

            return (
              <button
                key={item.ticker}
                onClick={() => handleViewDetails(item.ticker)}
                className="
                  text-left w-full
                  rounded-2xl border border-slate-200/80 dark:border-slate-800/80
                  bg-white/90 dark:bg-slate-900/80
                  px-4 py-3 shadow-soft
                  hover:bg-slate-50 dark:hover:bg-slate-800/90
                  transition-colors
                "
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {item.ticker}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {company}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${pillClass}`}
                  >
                    Signal: {item.signal}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
