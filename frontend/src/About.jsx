export default function About() {
  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <h1 className="text-3xl font-extrabold">About StockSight</h1>
      <p className="text-slate-600 dark:text-slate-300">
        StockSight is a lightweight toolkit to visualize classic technical indicators—RSI, MACD, and
        Bollinger Bands—on clean, interactive charts. It’s built with React + Vite on the frontend and a
        C++ API on the backend.
      </p>
      <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300">
        <li>Fast, simple UI</li>
        <li>Indicator toggles + summary signal</li>
        <li>Extendable endpoints for custom indicators</li>
      </ul>
    </section>
  );
}
