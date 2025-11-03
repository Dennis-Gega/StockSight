import { NavLink } from "react-router-dom";

const link = "px-3 py-2 rounded-lg text-sm font-medium hover:text-indigo-600";
const active = "text-indigo-600 bg-white/70 dark:bg-slate-900/60 shadow-soft";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 dark:border-slate-800/70 backdrop-blur bg-white/60 dark:bg-slate-900/60">
      <div className="container max-w-6xl flex items-center justify-between py-3">
        <NavLink to="/" className="font-extrabold tracking-tight text-xl">
          <span className="text-indigo-600">Stock</span>Sight
        </NavLink>
        <nav className="flex items-center gap-1">
          <NavLink to="/" className={({isActive}) => `${link} ${isActive?active:""}`}>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => `${link} ${isActive?active:""}`}>About</NavLink>
          <NavLink to="/team" className={({isActive}) => `${link} ${isActive?active:""}`}>Team</NavLink>
          <a href="https://recharts.org" target="_blank" rel="noreferrer" className={link}>Docs</a>
        </nav>
      </div>
    </header>
  );
}
