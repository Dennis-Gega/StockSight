import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./Home.jsx";
import Results from "./Results.jsx";
import About from "./About.jsx";
import Team from "./Team.jsx";

export default function App() {
  return (
    <BrowserRouter>
      {/* full-page background */}
      <div className="min-h-dvh w-full overflow-x-hidden bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950 bg-dots">
        <Navbar />

        {/* centered main content */}
        <main className="mx-auto max-w-6xl px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route
              path="*"
              element={
                <div className="py-24 text-center text-slate-600">
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
