import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/apiService";

// Pre-fill the 6 visible rows
const generateInitialRows = () => {
    return Array.from({ length: 6 }).map((_, i) => ({
        id: `initial-${i}`,
        activeCol: Math.floor(Math.random() * 4)
    }));
};

export default function GameMode() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(generateInitialRows);
    const [tilesHit, setTilesHit] = useState(0);
    const [tilesMissed, setTilesMissed] = useState(0);
    const [gameActive, setGameActive] = useState(true);
    const [showEndScreen, setShowEndScreen] = useState(false);
    const [sessionRewards, setSessionRewards] = useState(null);
    const [levelUp, setLevelUp] = useState(false);
    
    const idCounter = useRef(100);
    const sessionIdRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const missedInRowRef = useRef(0);

    // Start game session on mount
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        const startGame = async () => {
            try {
                const data = await apiService.startGame('normal');
                sessionIdRef.current = data.session_id;
            } catch (error) {
                console.error('Failed to start game:', error);
            }
        };

        startGame();

        return () => {
            // Cleanup on unmount
        };
    }, [isAuthenticated]);

    const handleTileClick = (rowIndex, colIndex, isTarget) => {
        if (rowIndex !== 0 || !gameActive) return;

        if (isTarget) {
            // Correct step!
            setScore(s => s + 10);
            setTilesHit(t => t + 1);
            missedInRowRef.current = 0;

            // Advance the board down
            setRows(curr => {
                const next = [...curr.slice(1)];
                idCounter.current += 1;
                next.push({
                    id: `row-${idCounter.current}`,
                    activeCol: Math.floor(Math.random() * 4)
                });
                return next;
            });

            if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(40);
            }
        } else {
            // Wrong step
            setTilesMissed(m => m + 1);
            missedInRowRef.current += 1;

            if (typeof navigator.vibrate === 'function') {
                navigator.vibrate([100, 50, 100]);
            }

            // Game over after 3 consecutive misses
            if (missedInRowRef.current >= 3) {
                endGameSession();
            }
        }
    };

    const endGameSession = async () => {
        if (!gameActive) return;

        setGameActive(false);
        const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

        try {
            const data = await apiService.endGame(
                sessionIdRef.current,
                score,
                durationSeconds,
                tilesHit,
                tilesMissed
            );

            setSessionRewards({
                xpEarned: data.session.xp_earned,
                accuracy: data.session.accuracy,
                difficulty: data.session.difficulty,
                newLevel: data.user_stats.level,
                totalXp: data.user_stats.total_xp,
            });

            if (data.user_stats.leveled_up) {
                setLevelUp(true);
            }

            if (data.new_achievements && data.new_achievements.length > 0) {
                // Show new achievements
                console.log('New achievements:', data.new_achievements);
            }

            setShowEndScreen(true);
        } catch (error) {
            console.error('Failed to end game:', error);
            setShowEndScreen(true);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    if (showEndScreen && sessionRewards) {
        return (
            <PageWrapper className="flex items-center justify-center min-h-dvh">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    {/* Level Up Animation */}
                    {levelUp && (
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mb-6 p-4 rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 text-center mb-6"
                        >
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Award className="w-6 h-6 text-yellow-400 animate-bounce" />
                                <p className="text-lg font-bold text-yellow-400">LEVEL UP!</p>
                                <Award className="w-6 h-6 text-yellow-400 animate-bounce" />
                            </div>
                            <p className="text-yellow-300">Level {sessionRewards.newLevel}</p>
                        </motion.div>
                    )}

                    {/* Game Results */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-3xl font-bold text-center mb-6 gradient-text">Game Over!</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[var(--color-text-secondary)]">Score</span>
                                <span className="text-2xl font-bold text-[var(--color-accent)]">{score}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[var(--color-text-secondary)]">Accuracy</span>
                                <span className="text-2xl font-bold text-[var(--color-primary)]">{sessionRewards.accuracy.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[var(--color-text-secondary)]">Tiles Hit</span>
                                <span className="text-2xl font-bold text-[var(--color-primary-light)]">{tilesHit}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[var(--color-text-secondary)]">Tiles Missed</span>
                                <span className="text-2xl font-bold text-red-400">{tilesMissed}</span>
                            </div>

                            <div className="h-px bg-[var(--color-border)] my-4" />

                            <div className="flex justify-between items-center">
                                <span className="text-[var(--color-text-secondary)] font-semibold">XP Earned</span>
                                <span className="text-3xl font-bold text-[var(--color-accent)] animate-pulse">+{sessionRewards.xpEarned}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/activities')}
                                className="py-3 rounded-lg bg-[var(--color-bg-light)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-bg-light)]/80 transition"
                            >
                                Back
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setShowEndScreen(false);
                                    setSessionRewards(null);
                                    setLevelUp(false);
                                    setScore(0);
                                    setTilesHit(0);
                                    setTilesMissed(0);
                                    setRows(generateInitialRows);
                                    setGameActive(true);
                                    idCounter.current = 100;
                                    missedInRowRef.current = 0;
                                    startTimeRef.current = Date.now();
                                }}
                                className="py-3 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold hover:opacity-90 transition"
                            >
                                Play Again
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper className="!pb-0 !px-0 bg-black min-h-dvh flex flex-col relative overflow-hidden">
            {/* Header / Score */}
            <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <button
                    onClick={() => {
                        if (gameActive) {
                            endGameSession();
                        } else {
                            navigate('/activities');
                        }
                    }}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white z-50 relative"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                    <p className="text-[10px] text-pink-400 font-bold uppercase tracking-widest leading-none mb-1">Score</p>
                    <p className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{score}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest leading-none mb-1">Accuracy</p>
                    <p className="text-2xl font-black text-cyan-300">
                        {tilesHit + tilesMissed > 0 ? ((tilesHit / (tilesHit + tilesMissed)) * 100).toFixed(0) : 0}%
                    </p>
                </div>
            </div>

            {/* Neon Grid Background */}
            <div className="absolute inset-0 perspective-1000 select-none pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,255,0.15)_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(60deg)_translateY(-100px)_translateZ(-200px)] opacity-40 animate-[gridMove_4s_linear_infinite]" />
            </div>

            {/* Game Lane Container */}
            <div className="flex-1 relative w-full max-w-sm mx-auto flex flex-col-reverse px-2 pb-8 pt-32 overflow-hidden z-10 touch-none">
                {/* 4 Lanes Background Dividers */}
                <div className="absolute top-0 bottom-0 left-2 right-2 flex pointer-events-none">
                    {[0, 1, 2, 3].map(lane => (
                        <div key={lane} className="flex-1 border-l border-r border-white/5 bg-white/[0.02]" />
                    ))}
                </div>

                <AnimatePresence initial={false}>
                    {rows.map((row, index) => {
                        const isBottom = index === 0;
                        return (
                            <motion.div
                                key={row.id}
                                layout
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 600, damping: 40 }}
                                className="w-full flex"
                                style={{ height: '16.666%' }}
                            >
                                {[0, 1, 2, 3].map(col => {
                                    const isTarget = row.activeCol === col;
                                    return (
                                        <div
                                            key={col}
                                            className="flex-1 p-[4px] relative flex items-center justify-center cursor-pointer"
                                            onPointerDown={(e) => {
                                                e.preventDefault();
                                                handleTileClick(index, col, isTarget);
                                            }}
                                        >
                                            {isTarget && (
                                                <motion.div
                                                    whileTap={isBottom ? { scale: 0.85 } : {}}
                                                    className={`w-full h-full rounded-xl transition-all relative overflow-hidden
                                                        ${isBottom
                                                            ? 'bg-gradient-to-b from-pink-400 to-pink-600 border-2 border-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.8)]'
                                                            : 'bg-gradient-to-b from-purple-500/50 to-pink-600/50 border border-pink-400/30 opacity-80'}`}
                                                >
                                                    <div className="absolute inset-x-2 top-2 h-2 rounded-full bg-white/20" />
                                                </motion.div>
                                            )}
                                        </div>
                                    )
                                })}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Target Line Area overlay */}
            <div className="absolute bottom-6 left-0 right-0 h-24 bg-gradient-to-t from-pink-500/20 to-transparent border-t-2 border-pink-500/50 shadow-[0_-10px_30px_rgba(236,72,153,0.2)] pointer-events-none z-20">
                <div className="w-full text-center mt-2 text-pink-400/80 font-bold tracking-widest text-xs">FORWARD STEP</div>
            </div>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                @keyframes gridMove {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 40px; }
                }
            `}</style>
        </PageWrapper>
    );
}
