// src/components/TickerForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchIndicators } from "../lib/api.js";

export default function TickerForm({ onError }) {
  const [tickerInput, setTickerInput] = useState("");
  const [range, setRange] = useState("1mo");
  const [interval, setInterval] = useState("1d");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tickerInput) return;

    try {
      const res = await fetchIndicators({
        ticker: tickerInput,
        range,
        interval,
      });

      if (!res?.data) {
        onError && onError(`No data returned for ${tickerInput.toUpperCase()}`);
        return;
      }

      onError && onError("");
      navigate(
        `/results?ticker=${tickerInput.toUpperCase()}&range=${range}&interval=${interval}`
      );
    } catch (err) {
      onError && onError(`No data returned for ${tickerInput.toUpperCase()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        value={tickerInput}
        onChange={(e) => setTickerInput(e.target.value)}
        placeholder="Enter ticker symbol"
        className="rounded border px-3 py-2 w-full"
      />
      <div className="flex gap-2">

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="rounded border px-2 py-1
                     text-slate-900 dark:text-slate-100
                     bg-white dark:bg-slate-800"
        >
          <option value="1mo">1 month</option>
          <option value="3mo">3 months</option>
          <option value="6mo">6 months</option>
          <option value="1y">1 year</option>
        </select>

        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="rounded border px-2 py-1
                     text-slate-900 dark:text-slate-100
                     bg-white dark:bg-slate-800"
        >
          <option value="1d">1 day</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Analyze
        </button>
      </div>
    </form>
  );
}
