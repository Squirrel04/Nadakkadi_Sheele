import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Footprints, Trophy, User } from "lucide-react";

const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Footprints, label: "Activities", path: "/activities" },
    { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
    { icon: User, label: "Profile", path: "/profile" },
];

export default function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 25, delay: 0.2 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4 pointer-events-none"
        >
            <div
                className="pointer-events-auto w-full flex items-center justify-around
                    py-3 px-4 rounded-[var(--radius-nav)]
                    bg-[var(--color-bg-surface)]/80 backdrop-blur-xl
                    border border-[var(--color-border)]
                    shadow-[var(--shadow-nav)]"
            >
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                            aria-label={item.label}
                            id={`nav-${item.label.toLowerCase()}`}
                        >
                            {/* Active indicator pill */}
                            {isActive && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute inset-0 bg-[var(--color-accent-dim)] rounded-2xl"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}

                            <Icon
                                className={`relative z-10 transition-all duration-200 ${isActive
                                    ? "w-6 h-6 text-[var(--color-accent)] drop-shadow-[0_0_8px_rgba(0,245,160,0.5)]"
                                    : "w-5 h-5 text-[var(--color-text-muted)]"
                                    }`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />

                            <span
                                className={`relative z-10 text-[10px] font-medium transition-all duration-200 ${isActive
                                    ? "text-[var(--color-accent)]"
                                    : "text-[var(--color-text-muted)]"
                                    }`}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </motion.nav>
    );
}
