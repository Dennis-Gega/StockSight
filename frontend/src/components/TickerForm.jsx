import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TickerForm({ initial = "AAPL" }) {
  const [ticker, setTicker] = useState(initial);
  const [range, setRange] = useState("1mo");
  const [interval, setInterval] = useState("1d");
  const navigate = useNavigate();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/results?ticker=${ticker.toUpperCase()}&range=${range}&interval=${interval}`);
      }}
      className="flex flex-col sm:flex-row gap-3 w-full"
    >
      <input
        value={ticker}
        onChange={(e) => setTicker(e.target.value.toUpperCase())}
        placeholder="Ticker (e.g., AAPL)"
        className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-3 bg-white/70 dark:bg-slate-900/70 shadow-soft focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <select
        value={range}
        onChange={(e) => setRange(e.target.value)}
        className="rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-3 bg-white/70 dark:bg-slate-900/70"
      >
        <option>1mo</option>
        <option>3mo</option>
        <option>6mo</option>
        <option>1y</option>
      </select>
      <select
        value={interval}
        onChange={(e) => setInterval(e.target.value)}
        className="rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-3 bg-white/70 dark:bg-slate-900/70"
      >
        <option>1d</option>
        <option>1h</option>
        <option>30m</option>
        <option>15m</option>
      </select>
      <button
        type="submit"
        className="rounded-xl bg-indigo-600 text-white px-5 py-3 font-medium hover:bg-indigo-700"
      >
        Analyze
      </button>
    </form>
  );
}
