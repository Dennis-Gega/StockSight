// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./Home.jsx";
import Results from "./Results.jsx";
import About from "./About.jsx";
import Team from "./Team.jsx";
import Favorites from "./favorites.jsx"; // <-- make sure this path is right

export default function App() {
  return (
    <BrowserRouter>
      {/* Full-page wrapper with light + dark background + dots */}
      <div
        className="
          min-h-dvh w-full overflow-x-hidden
          bg-slate-50
          dark:bg-slate-950
          bg-dots
        "
      >
        <Navbar />

        {/* Centered main content area */}
        <main className="mx-auto max-w-6xl px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route
              path="*"
              element={
                <div className="py-24 text-center text-slate-600 dark:text-slate-200">
                  Page not found
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
