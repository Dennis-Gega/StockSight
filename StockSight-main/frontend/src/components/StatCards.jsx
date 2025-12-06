export default function StatCards({ summary }) {
  if (!summary) return null;
  const items = [
    { label: "Signal", value: summary.signal ?? "—" },
    { label: "RSI", value: summary.rsi?.toFixed?.(1) ?? "—" },
    { label: "MACD", value: summary.macd?.toFixed?.(3) ?? "—" },
  ];
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {items.map((it) => (
        <div key={it.label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-5 shadow-soft">
          <div className="text-xs uppercase tracking-wide text-slate-500">{it.label}</div>
          <div className="mt-1 text-2xl font-semibold">{it.value}</div>
        </div>
      ))}
    </div>
  );
}
