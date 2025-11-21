import { NavLink } from "react-router-dom";

const linkBase =
  "px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-indigo-600";
const active =
  "text-indigo-700 bg-white/80 dark:bg-slate-900/70 shadow-soft";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 dark:border-slate-800/70 backdrop-blur bg-white/70 dark:bg-slate-900/70">
      <div className="container max-w-6xl flex items-center justify-between gap-4 py-3">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-soft">
            SS
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold tracking-tight text-lg">
              <span className="text-indigo-600">Stock</span>Sight
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Technical indicator sandbox
            </span>
          </div>
        </NavLink>

        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : "text-slate-600 dark:text-slate-200"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : "text-slate-600 dark:text-slate-200"}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/team"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : "text-slate-600 dark:text-slate-200"}`
            }
          >
            Team
          </NavLink>
          <a
            href="https://recharts.org"
            target="_blank"
            rel="noreferrer"
            className={`${linkBase} text-slate-500`}
          >
            Docs
          </a>
        </nav>
      </div>
    </header>
  );
}
