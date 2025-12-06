import TickerForm from "./components/TickerForm.jsx";

export default function Home() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Test classic indicators. <span className="text-indigo-600">See the signal.</span>
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Visualize price, RSI, MACD, and Bollinger Bands with a simple Buy/Sell/Hold summary.
        </p>
        <div className="mt-8">
          <TickerForm />
        </div>
        <p className="mt-6 text-xs text-slate-500">Built with React + Vite • Charts by Recharts</p>
      </div>
    </section>
  );
}
