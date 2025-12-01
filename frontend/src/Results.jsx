import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchIndicators } from "./lib/api.js";
import Loader from "./components/Loader.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import IndicatorToggles from "./components/IndicatorToggles.jsx";
import PriceChart from "./components/PriceChart.jsx";
import StatCards from "./components/StatCards.jsx";

export default function Results() {
  const [params] = useSearchParams();
  const ticker = params.get("ticker") || "AAPL";
  const range = params.get("range") || "1mo";
  const interval = params.get("interval") || "1d";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);
  const [toggles, setToggles] = useState({ rsi: true, macd: true, bb: true });

  useEffect(() => {
    (async () => {
      setLoading(true); setErr("");
      try {
        const res = await fetchIndicators({ ticker, range, interval });
        setData(res);
      } catch {
        setData(makeMock()); // temporary fallback
      } finally {
        setLoading(false);
      }
    })();
  }, [ticker, range, interval]);

  const chartData = useMemo(() => {
    if (!data?.prices) return [];
    return data.prices.map((p, i) => ({
      time: p.t ?? i,
      close: p.c,
      bb_upper: data?.indicators?.bb?.upper?.[i],
      bb_lower: data?.indicators?.bb?.lower?.[i],
    }));
  }, [data]);

  if (loading) return <Loader />;
  if (err) return <ErrorMessage>{err}</ErrorMessage>;

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">{ticker}</h2>
          <p className="text-sm text-slate-500">{range} • {interval}</p>
        </div>
        <IndicatorToggles state={toggles} onChange={setToggles} />
      </div>

      <StatCards summary={{
        signal: data?.signal,
        rsi: data?.indicators?.rsi?.at?.(-1),
        macd: data?.indicators?.macd?.macd?.at?.(-1),
      }}/>

      <PriceChart data={chartData} showBB={toggles.bb} />

      {/* room for RSI/MACD charts later */}
    </section>
  );
}

function makeMock() {
  const n = 60;
  const prices = Array.from({ length: n }, (_, i) => {
    const c = 150 + Math.sin(i / 6) * 4 + i * 0.1;
    return { t: i, c };
  });
  const bb = { upper: prices.map((p) => p.c + 2), lower: prices.map((p) => p.c - 2) };
  const rsi = Array.from({ length: n }, (_, i) => 50 + Math.sin(i / 4) * 10);
  const macd = { macd: Array.from({ length: n }, () => 0) };
  return { prices, indicators: { rsi, macd, bb }, signal: "Hold" };
}
