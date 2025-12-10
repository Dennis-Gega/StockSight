export default function ErrorMessage({ children }) {
  return (
    <div className="rounded-xl border border-red-300 bg-red-50 text-red-700 px-4 py-3">
      {children}
    </div>
  );
}
