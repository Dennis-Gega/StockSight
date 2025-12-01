import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart, Legend,
} from "recharts";

export default function PriceChart({ data, showBB = true }) {
  if (!data?.length) return null;
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4 shadow-soft">
      <div className="text-sm font-medium mb-2">Price</div>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" hide />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="close" name="Close" dot={false} />
          {showBB && (
            <>
              <Line type="monotone" dataKey="bb_upper" name="BB Upper" dot={false} />
              <Line type="monotone" dataKey="bb_lower" name="BB Lower" dot={false} />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
