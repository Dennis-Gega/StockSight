import { useSearchParams } from "react-router-dom";
import TickerForm from "./components/TickerForm.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";

export default function Home() {
  const [params] = useSearchParams();
  const errorMessage = params.get("error");

  return (
    <section className="py-16 sm:py-24 flex justify-center">
      <div className="w-full max-w-4xl text-center px-4 space-y-10">

        {/* Error message (centered) */}
        {errorMessage && (
          <div className="flex justify-center">
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </div>
        )}

        {/* Tagline */}
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-[0.25em] text-indigo-500 uppercase">
            STOCKSIGHT • TECHNICAL INDICATOR SANDBOX
          </p>

          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
            Test classic indicators.{" "}
            <span className="text-indigo-600">See the signal clearly.</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Type a ticker and visualize price, RSI, MACD, and Bollinger Bands
            with Buy / Sell / Hold signals computed by your C++ backend.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-xl mx-auto bg-white/80 dark:bg-slate-900/70 rounded-2xl p-6 shadow-soft backdrop-blur">
          <TickerForm />
          <p className="mt-3 text-xs text-slate-500">
            Try symbols like <strong>AAPL</strong>, <strong>MSFT</strong>, or <strong>SPY</strong>.
          </p>
        </div>

        <p className="text-xs text-slate-500">
          Built with React + Vite • Backed by C++ + TimescaleDB
        </p>
      </div>
    </section>
  );
}
