export default function About() {
  return (
    <section className="mx-auto max-w-4xl space-y-8 py-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.3em] text-indigo-500 uppercase">
          ABOUT
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          About StockSight
        </h1>
        <p className="text-sm text-slate-500">
          A small project with a simple goal: make classic technical indicators
          fast, visual, and easy to experiment with.
        </p>
      </header>

      {/* Intro */}
      <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
        StockSight is a lightweight toolkit for exploring price action and
        popular technical indicators such as <strong>RSI</strong>,{" "}
        <strong>MACD</strong>, and <strong>Bollinger Bands</strong>. It is
        designed for people who want a clean visual read on the market without
        digging through a full trading platform or a cluttered dashboard.
      </p>

      <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
        The app pairs a <strong>React + Vite</strong> frontend with a
        high-performance <strong>C++ API</strong> that handles the heavy
        lifting: fetching data, computing indicators, and generating an
        overall Buy / Hold / Sell signal. The result is a simple front-end
        interface sitting on top of a serious calculation engine.
      </p>

      {/* Features grid */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/80 p-4 shadow-soft">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            What you can do
          </h2>
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li>• Type any valid ticker and view recent price history.</li>
            <li>• Overlay RSI, MACD, and Bollinger Bands on the same chart.</li>
            <li>• Toggle indicators on and off to focus on what matters.</li>
            <li>• Glance at a summary signal instead of reading raw numbers.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/80 p-4 shadow-soft">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Under the hood
          </h2>
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li>• React + Vite frontend for fast reloads and a smooth UI.</li>
            <li>• C++ backend for indicator math and signal logic.</li>
            <li>• TimescaleDB for working with time-series price data.</li>
            <li>• REST-style API endpoints, ready for more indicators later.</li>
          </ul>
        </div>
      </section>

      {/* Who it's for */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Who StockSight is for
        </h2>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
          StockSight is meant for curious traders, students, and developers who
          care about how indicators work and want a clear visual read on them.
          It is not a brokerage or a trading bot. Instead, it is a safe place
          to experiment with settings, compare indicators, and learn how
          signals change as prices move.
        </p>
      </section>

      <p className="text-xs text-slate-500">
        Disclaimer: StockSight is a personal / academic project and does not
        provide financial advice. Always do your own research before making any
        investment decisions.
      </p>
    </section>
  );
}
