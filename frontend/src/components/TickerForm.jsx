// src/components/TickerForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TickerForm() {
  const [ticker, setTicker] = useState("");
  const [range, setRange] = useState("1mo");
  const [interval, setInterval] = useState("1d");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticker) return;

    const params = new URLSearchParams({
      ticker: ticker.toUpperCase(),
      range,
      interval,
    }).toString();

    navigate(`/results?${params}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Row 1: ticker input */}
      <input
        type="text"
        placeholder="Ticker symbol (e.g., AAPL)"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   text-sm"
      />

      {/* Row 2: range, interval, button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     text-sm"
        >
          <option value="1mo">1 month</option>
          <option value="3mo">3 months</option>
          <option value="6mo">6 months</option>
          <option value="1y">1 year</option>
        </select>

        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     text-sm"
        >
          <option value="1d">1 day</option>
          <option value="1wk">1 week</option>
        </select>

        <button
          type="submit"
          className="w-full sm:w-auto rounded-lg bg-indigo-600 px-5 py-2
                     text-sm font-semibold text-white
                     hover:bg-indigo-700 transition-colors"
        >
          Analyze
        </button>
      </div>
    </form>
  );
}
