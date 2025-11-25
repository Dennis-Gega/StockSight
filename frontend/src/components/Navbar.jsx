import { NavLink } from "react-router-dom";
import TickerForm from "./TickerForm.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

const linkBase =
  "px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-indigo-600";
const active =
  "bg-white/80 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-soft";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 dark:border-slate-800/70 backdrop-blur bg-white/70 dark:bg-slate-900/70 w-full">
      <div className="flex items-center justify-between max-w-full mx-4 py-3">
        {/* Brand on the far left */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-soft">
            SS
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold tracking-tight text-lg">
              <span className="text-indigo-600">Stock</span>Sight
            </span>
            <span className="text-xs font-medium tracking-[0.25em]
                            text-slate-500 dark:text-slate-200 uppercase">
              Technical indicator sandbox
            </span>
          </div>
        </NavLink>

        {/* Links on the far right */}
        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? active : "text-slate-600 dark:text-slate-200"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? active : "text-slate-600 dark:text-slate-200"
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/team"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? active : "text-slate-600 dark:text-slate-200"
              }`
            }
          >
            Team
          </NavLink>
          <a
            href="https://recharts.org"
            target="_blank"
            rel="noreferrer"
            className={`${linkBase} text-slate-500 dark:text-slate-200`}
          >
            Docs
          </a>
        </nav>
      </div>
    </header>
  );
}
