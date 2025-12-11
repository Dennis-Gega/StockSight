import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getFavorites, removeFavorite } from "./lib/favorites.js";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const list = getFavorites();
    setFavorites(list);
  }, []);

  function handleOpenInResults(symbol) {
    const qs = new URLSearchParams({
      ticker: symbol,
      range: "1y",
      interval: "1d"
    }).toString();
    navigate(`/results?${qs}`);
  }

  function handleRemove(symbol) {
    removeFavorite(symbol);
    setFavorites(favorites.filter((s) => s !== symbol));
  }

  return (
    <section className="mx-auto max-w-6xl py-8 space-y-6 text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-indigo-600 dark:text-indigo-300">
            WATCHLIST
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
            Favorites
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Quickly jump back into symbols you care about, with a default 1 year
            view.
          </p>
        </div>

        <Link
          to="/"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          ← Back to Home
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 px-6 py-10 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No favorites yet. Go to a ticker&apos;s results page and click{" "}
            <span className="font-semibold">“Add to favorites”</span> to pin it
            here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70">
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {favorites.map((symbol) => (
              <li
                key={symbol}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 text-sm font-semibold">
                    {symbol.slice(0, 4).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {symbol.toUpperCase()}
                    </p>
                    <a
                      href={`https://finance.yahoo.com/quote/${symbol}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-600 dark:text-indigo-300 hover:underline"
                    >
                      View on Yahoo Finance
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenInResults(symbol)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700"
                  >
                    View in StockSight (1Y)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(symbol)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
