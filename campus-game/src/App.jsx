import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import GameMode from "./pages/GameMode";

// Create a wrapper for routing that can read location to hide nav
function AppContent() {
  const location = useLocation();
  const isPlaying = location.pathname === '/play';

  return (
    <div className="min-h-dvh bg-[var(--color-bg-deep)]">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/play" element={<GameMode />} />
        </Routes>
      </AnimatePresence>
      {/* Hide navigation on the live game screen */}
      {!isPlaying && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;