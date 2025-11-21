function safeNum(x) {
  return Number.isFinite(x) ? x : null;
}

function getSignalStyles(signalRaw) {
  const signal = (signalRaw || "").toLowerCase();
  if (signal === "buy") {
    return {
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
      value: "text-emerald-700",
      label: "text-emerald-800",
      arrow: "↑",
    };
  }
  if (signal === "sell") {
    return {
      badge: "bg-rose-100 text-rose-700 border-rose-200",
      value: "text-rose-700",
      label: "text-rose-800",
      arrow: "↓",
    };
  }
  if (signal === "hold") {
    return {
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      value: "text-amber-700",
      label: "text-amber-800",
      arrow: "→",
    };
  }
  return {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    value: "text-slate-800",
    label: "text-slate-600",
    arrow: "",
  };
}

export default function StatCards({ summary }) {
  if (!summary) return null;

  const { signal } = summary;
  const rsi = safeNum(summary.rsi);
  const macd = safeNum(summary.macd);

  const signalStyles = getSignalStyles(signal);

  const items = [
    {
      label: "Signal",
      value: signal ?? "—",
      highlight: true,
      styles: signalStyles,
    },
    {
      label: "RSI (last)",
      value: rsi !== null ? rsi.toFixed(1) : "—",
    },
    {
      label: "MACD (last)",
      value: macd !== null ? macd.toFixed(3) : "—",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-5 shadow-soft flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              {it.label}
            </div>
            {it.highlight && (
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${signalStyles.badge}`}
              >
                {signalStyles.arrow && <span>{signalStyles.arrow}</span>}
                <span>{signal || "—"}</span>
              </span>
            )}
          </div>
          <div
            className={`mt-2 text-2xl font-semibold ${
              it.highlight ? signalStyles.value : ""
            }`}
          >
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}
