const base =
  "inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors";
const active =
  "bg-indigo-600 text-white border-indigo-600 shadow-soft";
const inactive =
  "bg-white/80 dark:bg-slate-900/70 text-slate-600 dark:text-slate-200 border-slate-300 dark:border-slate-700";

export default function IndicatorToggles({ state, onChange }) {
  const { rsi, macd, bb } = state;

  function toggle(key) {
    onChange({ ...state, [key]: !state[key] });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-xs uppercase tracking-[0.16em] text-slate-500 mr-1">
        Indicators
      </span>
      <button
        type="button"
        onClick={() => toggle("rsi")}
        className={`${base} ${rsi ? active : inactive}`}
      >
        RSI
      </button>
      <button
        type="button"
        onClick={() => toggle("macd")}
        className={`${base} ${macd ? active : inactive}`}
      >
        MACD
      </button>
      <button
        type="button"
        onClick={() => toggle("bb")}
        className={`${base} ${bb ? active : inactive}`}
      >
        Bollinger
      </button>
    </div>
  );
}
