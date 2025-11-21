import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchIndicators } from "../lib/api.js";

export default function TickerForm({ initial = "AAPL" }) {
  const [ticker, setTicker] = useState(initial);
  const [range, setRange] = useState("1mo");
  const [interval, setInterval] = useState("1d");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = ticker.trim().toUpperCase();

    if (!trimmed) {
      setError("Please enter a ticker symbol.");
      return;
    }

    setError("");

    // 🎯 Step 1: call backend to verify ticker exists
    const check = await fetchIndicators({
      ticker: trimmed,
      range,
      interval
    });

    if (!check.ok) {
      setError(check.error || "Ticker not found.");
      return; // stop — do NOT navigate
    }

    // 🎯 Step 2: ticker exists → navigate
    const params = new URLSearchParams({
      ticker: trimmed,
      range,
      interval,
    }).toString();

    navigate(`/results?${params}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 w-full sm:flex-row sm:items-stretch"
    >
      <div className="flex-1">
        <input
          id="ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Ticker (e.g., AAPL)"
          className={`w-full rounded-xl border px-4 py-3 bg-white/70 dark:bg-slate-900/70 shadow-soft focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            error
              ? "border-red-400 focus:ring-red-500"
              : "border-slate-300 dark:border-slate-700"
          }`}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500 text-left">
            {error}
          </p>
        )}
      </div>

      <div className="flex gap-2 sm:gap-3">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-3 bg-white/70 dark:bg-slate-900/70 text-sm"
        >
          <option value="1mo">1 month</option>
          <option value="3mo">3 months</option>
          <option value="6mo">6 months</option>
          <option value="1y">1 year</option>
        </select>

        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-3 bg-white/70 dark:bg-slate-900/70 text-sm"
        >
          <option value="1d">1 day</option>
          <option value="1h">1 hour</option>
          <option value="30m">30 min</option>
          <option value="15m">15 min</option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-indigo-600 text-white px-5 py-3 text-sm font-semibold shadow-soft hover:bg-indigo-700"
        >
          Analyze
        </button>
      </div>
    </form>
  );
}
