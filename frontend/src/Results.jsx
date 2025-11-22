import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchIndicators } from "./lib/api.js";

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

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);

      try {
        const res = await fetchIndicators({ ticker, range, interval });

        if (!cancelled) {
          setData(res);
        }
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

  // Extract nested structure
  const inner = data?.data;
  const prices = inner?.prices || [];
  const indicators = inner?.indicators;

  const latestRsi = indicators?.rsi?.at?.(-1);
  const latestMacd = indicators?.macd?.macd?.at?.(-1);
  const signal = inner?.signal;

  // Build chart data
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

  if (!inner) {
    return (
      <section className="mx-auto max-w-4xl py-10">
        <ErrorMessage>No data returned for {ticker}.</ErrorMessage>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl py-8 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-indigo-500">
            Analysis overview
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight">{ticker}</h2>

          <p className="text-sm text-slate-500">
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
      />

      <PriceChart data={chartData} showBB={toggles.bb} />
    </section>
  );
}
