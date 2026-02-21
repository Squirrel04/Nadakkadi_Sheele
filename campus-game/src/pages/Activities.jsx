import { motion } from "framer-motion";
import { Gamepad2, Play, TrendingUp, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/apiService";

const containerVariants = {
    animate: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

const difficultyLevels = [
    { name: "Easy", difficulty: "easy", description: "Best for beginners", color: "from-green-500 to-green-600" },
    { name: "Normal", difficulty: "normal", description: "Standard gameplay", color: "from-blue-500 to-blue-600" },
    { name: "Hard", difficulty: "hard", description: "Challenge yourself", color: "from-purple-500 to-purple-600" },
    { name: "Insane", difficulty: "insane", description: "For the pros", color: "from-red-500 to-red-600" },
];

export default function Activities() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [gameHistory, setGameHistory] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentGames();
    }, []);

    const fetchRecentGames = async () => {
        try {
            const data = await apiService.getGameHistory(5);
            setGameHistory(data.sessions);
        } catch (error) {
            console.error('Failed to fetch game history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartGame = async () => {
        try {
            await apiService.startGame(selectedDifficulty);
            navigate('/play');
        } catch (error) {
            console.error('Failed to start game:', error);
        }
    };

    return (
        <PageWrapper>
            <motion.div variants={containerVariants} initial="initial" animate="animate">
                <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-1 gradient-text">
                    Activities
                </motion.h1>
                <motion.p variants={itemVariants} className="text-sm text-[var(--color-text-secondary)] mb-6">
                    Play games to earn XP and climb the leaderboard
                </motion.p>

                {/* DIFFICULTY SELECTOR */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-widest">
                        Select Difficulty
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {difficultyLevels.map((level) => (
                            <button
                                key={level.difficulty}
                                onClick={() => setSelectedDifficulty(level.difficulty)}
                                className={`p-3 rounded-lg transition-all ${selectedDifficulty === level.difficulty
                                        ? `bg-gradient-to-br ${level.color} text-white border-2 border-white/50 scale-105`
                                        : 'glass-card border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-border-active)]'
                                    }`}
                            >
                                <p className="font-bold text-sm">{level.name}</p>
                                <p className="text-xs text-opacity-80 mt-0.5 opacity-80">{level.description}</p>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* START LIVE GAME CTA */}
                <motion.button
                    variants={itemVariants}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={handleStartGame}
                    className="w-full relative overflow-hidden rounded-[var(--radius-card)] p-[2px] mb-8 cursor-pointer focus:outline-none group"
                >
                    {/* Animated gradient border */}
                    <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-[shimmer_3s_linear_infinite] bg-[length:200%_auto]" />

                    {/* Inner styling */}
                    <div className="relative bg-[var(--color-bg-deep)] h-full w-full rounded-[calc(var(--radius-card)-2px)] p-6 flex flex-col items-center justify-center border border-white/5 backdrop-blur-xl transition-all duration-300 group-hover:bg-pink-500/10">
                        {/* Glow effect behind icon */}
                        <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-600 to-purple-500 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.5)] mb-3 relative z-10 transition-transform duration-300 group-hover:scale-110">
                            <Play fill="currentColor" className="w-8 h-8 text-white ml-2" />
                        </div>

                        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-white uppercase tracking-widest relative z-10 text-center">
                            Start Game
                        </h2>
                        <p className="text-xs text-pink-300/80 mt-1 font-medium relative z-10 uppercase tracking-widest text-center">
                            Jump on the pink tiles - {selectedDifficulty} mode
                        </p>
                    </div>
                </motion.button>

                {/* GAME MODES INFO */}
                <motion.div variants={itemVariants} className="mb-8 glass-card p-4">
                    <div className="flex items-start gap-3">
                        <Gamepad2 className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-[var(--color-text-primary)] text-sm">How to Play</p>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                Tap the pink tiles as they fall. Miss 3 times and the game ends. Earn XP based on your score and accuracy!
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* RECENT GAMES */}
                <motion.div variants={itemVariants}>
                    <h3 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                        <span className="w-full h-px bg-[var(--color-border)] flex-1"></span>
                        Recent Games
                        <span className="w-full h-px bg-[var(--color-border)] flex-1"></span>
                    </h3>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent)]" />
                        </div>
                    ) : gameHistory.length > 0 ? (
                        <div className="space-y-3">
                            {gameHistory.map((game, idx) => (
                                <motion.div
                                    key={game.id}
                                    variants={itemVariants}
                                    className="glass-card p-4 flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0">
                                        <Target className="w-6 h-6 text-[var(--color-accent)]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-[var(--color-text-primary)] text-sm">
                                            {game.score} Points
                                        </p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[10px] bg-[var(--color-accent-dim)] text-[var(--color-accent)] px-2 py-0.5 rounded">
                                                {game.accuracy.toFixed(1)}% Accuracy
                                            </span>
                                            <span className="text-[10px] bg-[var(--color-primary-dim)] text-[var(--color-primary)] px-2 py-0.5 rounded capitalize">
                                                {game.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[var(--color-text-primary)]">+{game.xp_earned}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">XP</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-6 text-center">
                            <p className="text-[var(--color-text-secondary)] text-sm">No games played yet.</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">Start playing to see your game history!</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </PageWrapper>
    );
}
