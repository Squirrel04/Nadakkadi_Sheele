import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import GameMode from "./pages/GameMode";
import Auth from "./pages/Auth";
import { useAuth } from "./context/AuthContext";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-[var(--color-bg-deep)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]" />
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Create a wrapper for routing that can read location to hide nav
function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isPlaying = location.pathname === '/play';
  const isAuth = location.pathname === '/auth';

  return (
    <div className="min-h-dvh bg-[var(--color-bg-deep)]">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/play" element={<ProtectedRoute><GameMode /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
      {/* Hide navigation on auth and game screens */}
      {!isAuth && !isPlaying && isAuthenticated && <BottomNav />}
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