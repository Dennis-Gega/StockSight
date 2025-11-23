export default function About() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-extrabold">About StockSight</h1>
      
      <p className="text-slate-600 dark:text-slate-300">
        StockSight is a comprehensive toolkit for traders, analysts, and enthusiasts to visualize 
        classic technical indicators like <strong>RSI</strong>, <strong>MACD</strong>, and 
        <strong> Bollinger Bands</strong> on clean, interactive charts. Its goal is to provide 
        actionable insights into stock price movements and market trends with minimal friction.
      </p>
      
      <p className="text-slate-600 dark:text-slate-300">
        Built with <strong>React + Vite</strong> on the frontend and a high-performance <strong>C++ API</strong> 
        on the backend, StockSight ensures fast data processing and responsive, dynamic visualizations. 
        Users can analyze price history, track signals, and evaluate multiple indicators simultaneously.
      </p>
      
      <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
        <li><strong>Intuitive UI:</strong> A clean and simple interface that highlights key information at a glance.</li>
        <li><strong>Interactive Charts:</strong> Zoom, hover, and filter price data and indicators to explore trends.</li>
        <li><strong>Indicator Toggles:</strong> Turn on/off RSI, MACD, or Bollinger Bands to customize the analysis.</li>
        <li><strong>Summary Signals:</strong> Quickly understand market sentiment with Buy/Hold/Sell indicators.</li>
        <li><strong>Extendable API:</strong> Add custom indicators or integrate new data sources without rewriting the core.</li>
        <li><strong>Cross-platform:</strong> Fully responsive for desktop, tablet, and mobile usage.</li>
      </ul>
      
      <p className="text-slate-600 dark:text-slate-300">
        StockSight is designed to bridge the gap between traditional technical analysis and modern 
        interactive web technologies, making it easier for traders of all levels to make informed decisions.
      </p>
    </section>
  );
}
