export default function IndicatorToggles({ state, onChange }) {
  const { rsi, macd, bb } = state;
  return (
    <div className="flex flex-wrap gap-3">
      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={rsi} onChange={() => onChange({ ...state, rsi: !rsi })} />
        <span>RSI</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={macd} onChange={() => onChange({ ...state, macd: !macd })} />
        <span>MACD</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={bb} onChange={() => onChange({ ...state, bb: !bb })} />
        <span>Bollinger Bands</span>
      </label>
    </div>
  );
}
