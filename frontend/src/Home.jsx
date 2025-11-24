// src/Home.jsx
import { useSearchParams } from "react-router-dom";
import TickerForm from "./components/TickerForm.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";

export default function Home() {
  const [params] = useSearchParams();
  const errorMessage = params.get("error");

  return (
    <section className="min-h-[calc(100vh-72px)] flex items-center">
      {/* Bigger central container */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-20">
        {/* Error message (centered at top of hero) */}
        {errorMessage && (
          <div className="mb-6 flex justify-center">
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </div>
        )}

        {/* Two-column hero, zoomed in */}
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* LEFT: headline + copy */}
          <div className="space-y-8">
            <p className="text-xs font-semibold tracking-[0.3em] text-indigo-500 uppercase">
              STOCKSIGHT • TECHNICAL INDICATOR SANDBOX
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05]">
              Test classic indicators.{" "}
              <span className="text-indigo-600">See the signal clearly.</span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Enter a ticker and instantly visualize price, RSI, MACD, and Bollinger
              Bands — with Buy / Sell / Hold signals computed by a C++ backend
              and served through a lightweight API.
            </p>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-slate-700 shadow-sm">
                ⚡ React + Vite frontend
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-slate-700 shadow-sm">
                🧮 C++ indicator engine
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-slate-700 shadow-sm">
                📈 RSI, MACD &amp; Bollinger Bands
              </span>
            </div>
          </div>

          {/* RIGHT: quick test card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <span>Quick test</span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                  Live demo
                </span>
              </div>

              {/* Keep your existing TickerForm, just lives here */}
              <div className="space-y-3">
                <TickerForm />
                <p className="text-[11px] text-slate-500">
                  Try symbols like <strong>AAPL</strong>, <strong>MSFT</strong>,{" "}
                  <strong>NVDA</strong>, or any other valid ticker.
                </p>
              </div>

              <p className="mt-4 text-[11px] text-center text-slate-400">
                Built with React + Vite • Backed by C++ + TimescaleDB
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
