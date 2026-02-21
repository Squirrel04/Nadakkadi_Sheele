import { motion } from "framer-motion";
import { LogOut, Settings, Bell, ChevronRight, Trophy, Flame, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/apiService";

const containerVariants = {
    animate: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [achievements, setAchievements] = useState({ unlocked: [], locked: [] });
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const [achievementsData, statsData] = await Promise.all([
                apiService.getUserAchievements(),
                apiService.getUserStats(),
            ]);
            setAchievements(achievementsData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to fetch profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    if (loading) {
        return (
            <PageWrapper>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]" />
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <motion.div variants={containerVariants} initial="initial" animate="animate">
                <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-6 gradient-text">
                    Profile
                </motion.h1>

                {/* Avatar & Info */}
                <motion.div variants={itemVariants} className="glass-card p-6 flex items-center gap-5 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shrink-0 animate-pulse-glow">
                        <span className="text-2xl font-bold text-white">
                            {user?.username?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{user?.full_name || user?.username}</h2>
                        <p className="text-xs text-[var(--color-text-muted)]">Level {user?.level || 1} Player</p>
                    </div>
                </motion.div>

                {/* Stats Row */}
                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
                    <div className="glass-card p-4 text-center">
                        <p className="text-lg font-bold text-[var(--color-text-primary)]">{user?.total_xp || 0}</p>
                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">
                            Total XP
                        </p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <p className="text-lg font-bold text-[var(--color-text-primary)]">{user?.total_games_played || 0}</p>
                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">
                            Games Played
                        </p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <p className="text-lg font-bold text-[var(--color-text-primary)]">{user?.best_streak || 0}d</p>
                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">
                            Best Streak
                        </p>
                    </div>
                </motion.div>

                {/* Achievements Section */}
                <motion.div variants={itemVariants}>
                    <h3 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                        <span className="w-full h-px bg-[var(--color-border)] flex-1"></span>
                        Achievements ({achievements.unlocked.length}/{achievements.total_available})
                        <span className="w-full h-px bg-[var(--color-border)] flex-1"></span>
                    </h3>

                    {achievements.unlocked.length > 0 ? (
                        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
                            {achievements.unlocked.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className="glass-card p-3 flex flex-col items-center text-center border border-yellow-500/30 bg-yellow-500/10"
                                    title={achievement.description}
                                >
                                    <div className="text-3xl mb-1">{achievement.icon}</div>
                                    <p className="text-[10px] font-bold text-[var(--color-text-primary)] leading-tight">
                                        {achievement.name}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div variants={itemVariants} className="glass-card p-4 text-center mb-6">
                            <p className="text-sm text-[var(--color-text-secondary)]">Start playing to unlock achievements!</p>
                        </motion.div>
                    )}

                    {achievements.locked.length > 0 && (
                        <>
                            <h3 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 px-2">
                                Locked Achievements
                            </h3>
                            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6 opacity-50">
                                {achievements.locked.slice(0, 3).map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className="glass-card p-3 flex flex-col items-center text-center"
                                        title={achievement.description}
                                    >
                                        <div className="text-3xl mb-1 opacity-50">🔒</div>
                                        <p className="text-[10px] font-bold text-[var(--color-text-primary)] leading-tight">
                                            {achievement.name}
                                        </p>
                                    </div>
                                ))}
                            </motion.div>
                        </>
                    )}
                </motion.div>

                {/* Quick Stats */}
                {stats && (
                    <motion.div variants={itemVariants} className="mb-6">
                        <h3 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                            <span className="w-full h-px bg-[var(--color-border)] flex-1"></span>
                            Game Statistics
                            <span className="w-full h-px bg-[var(--color-border)] flex-1"></span>
                        </h3>
                        <div className="space-y-2">
                            <div className="glass-card p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm text-[var(--color-text-secondary)]">Highest Score</span>
                                </div>
                                <span className="font-bold text-[var(--color-text-primary)]">{stats.statistics.highest_score}</span>
                            </div>
                            <div className="glass-card p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm text-[var(--color-text-secondary)]">Average Score</span>
                                </div>
                                <span className="font-bold text-[var(--color-text-primary)]">{stats.statistics.average_score.toFixed(0)}</span>
                            </div>
                            <div className="glass-card p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Flame className="w-4 h-4 text-orange-400" />
                                    <span className="text-sm text-[var(--color-text-secondary)]">Current Streak</span>
                                </div>
                                <span className="font-bold text-[var(--color-text-primary)]">{stats.streaks.current} days</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Logout Button */}
                <motion.button
                    variants={itemVariants}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogout}
                    className="w-full glass-card p-4 flex items-center gap-4 text-left
                 cursor-pointer transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/10
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <span className="flex-1 text-sm font-medium text-red-500">Logout</span>
                    <ChevronRight className="w-4 h-4 text-red-500/50" />
                </motion.button>
            </motion.div>
        </PageWrapper>
    );
}
