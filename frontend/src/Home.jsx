// src/Home.jsx
import { useState } from "react";
import TickerForm from "./components/TickerForm.jsx";

export default function Home() {
  // Error message coming from TickerForm when a ticker is invalid
  const [tickerError, setTickerError] = useState("");

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      {/* Bigger, wider central container */}
      <div className="grid w-full max-w-[1200px] gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
        {/* Left: Hero copy */}
        <section className="space-y-6">
          <p className="text-xs font-semibold tracking-[0.28em] text-indigo-500 uppercase">
            STOCKSIGHT • TECHNICAL INDICATOR SANDBOX
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
            Test classic indicators.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">
              See the signal clearly.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl">
            Enter a ticker and instantly visualize price, RSI, MACD, and Bollinger Bands —
            with Buy / Sell / Hold signals computed by a C++ backend and served through
            a lightweight API.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
              ⚡ React + Vite frontend
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
              📈 C++ indicator engine
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
              📊 RSI, MACD &amp; Bollinger Bands
            </span>
          </div>
        </section>

        {/* Right: Quick test card */}
        <section className="w-full">
          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 shadow-soft backdrop-blur p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-500">
                  Quick test
                </p>
                <p className="text-sm font-medium text-slate-800">
                  Run an indicator snapshot
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Live demo
              </span>
            </div>

            {/* Form */}
            <TickerForm onError={setTickerError} />

            {/* Inline error for invalid tickers */}
            {tickerError && (
              <p className="mt-3 text-xs text-red-600 bg-red-50/80 border border-red-200 rounded-lg px-3 py-2 text-left">
                {tickerError}
              </p>
            )}

            <p className="mt-2 text-[11px] text-slate-500">
              Try symbols like <span className="font-semibold">AAPL</span>,{" "}
              <span className="font-semibold">MSFT</span>,{" "}
              <span className="font-semibold">NVDA</span>, or any other valid ticker.
            </p>

            <p className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 mt-2">
              Built with React + Vite • Backed by C++ + TimescaleDB
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
