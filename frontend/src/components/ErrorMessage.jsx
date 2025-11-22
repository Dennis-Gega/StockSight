export default function ErrorMessage({ children }) {
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-rose-200 bg-rose-50/90 px-4 py-2 text-xs sm:text-sm font-medium text-rose-700 shadow-soft">
      <span className="text-sm">❌</span>
      <span className="truncate">{children}</span>
    </div>
  );
}
