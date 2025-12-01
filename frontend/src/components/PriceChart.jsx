import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function PriceChart({ data, showBB = true }) {
  if (!data?.length) return null;

  const isDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const axisColor = isDark ? "#e5e7eb" : "#475569"; // brighter in dark
  const gridColor = isDark ? "rgba(148,163,184,0.5)" : "rgba(148,163,184,0.35)";

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-4 shadow-soft">
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
          Price &amp; Bands
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-300">
          Close price with Bollinger Bands
        </div>
      </div>

      <div className="h-[360px] min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

            <XAxis
              dataKey="time"
              type="number"
              // flip the axis: newest date on the left, oldest on the right
              domain={["dataMin", "dataMax"]}

              tickFormatter={(unix) => new Date(unix).toLocaleDateString()}
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 11 }}
            />

            <YAxis
              domain={["auto", "auto"]}
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 11 }}
            />

            <Tooltip
              labelFormatter={(unix) => new Date(unix).toLocaleString()}
              contentStyle={{
                fontSize: "0.8rem",
                backgroundColor: isDark ? "#020617" : "#ffffff",
                color: isDark ? "#e5e7eb" : "#0f172a",
                borderRadius: "0.75rem",
                border: "1px solid rgba(148,163,184,0.4)",
              }}
            />

            <Legend
              wrapperStyle={{
                color: axisColor,
                fontSize: "0.75rem",
              }}
            />

            {/* PRICE LINE */}
            <Line
              type="monotone"
              dataKey="close"
              name="Close"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={false}
            />

            {/* BOLLINGER BANDS */}
            {showBB && (
              <>
                <Line
                  type="monotone"
                  dataKey="bb_upper"
                  name="BB Upper"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="bb_lower"
                  name="BB Lower"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  dot={false}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}