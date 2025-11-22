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

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-4 shadow-soft">
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-sm font-medium">Price &amp; Bands</div>
        <div className="text-xs text-slate-500">
          Close price with Bollinger Bands
        </div>
      </div>

      <div className="h-[360px] min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(unix) => new Date(unix).toLocaleDateString()}
            />

            <YAxis domain={["auto", "auto"]} />

            <Tooltip
              labelFormatter={(unix) => new Date(unix).toLocaleString()}
              contentStyle={{ fontSize: "0.8rem" }}
            />

            <Legend />

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
