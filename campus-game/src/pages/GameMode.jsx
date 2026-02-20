import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

// Pre-fill the 6 visible rows
const generateInitialRows = () => {
    return Array.from({ length: 6 }).map((_, i) => ({
        id: `initial-${i}`,
        activeCol: Math.floor(Math.random() * 4)
    }));
};

export default function GameMode() {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(generateInitialRows);
    const idCounter = useRef(100);

    const handleTileClick = (rowIndex, colIndex, isTarget) => {
        // Only allow interacting with the very bottom row (index 0)
        if (rowIndex !== 0) return;

        if (isTarget) {
            // Correct step!
            setScore(s => s + 10);

            // Advance the board down
            setRows(curr => {
                const next = [...curr.slice(1)]; // Remove the bottom row
                idCounter.current += 1;
                // Add a new row at the top
                next.push({
                    id: `row-${idCounter.current}`,
                    activeCol: Math.floor(Math.random() * 4)
                });
                return next;
            });

            // Subtle mobile vibration if supported
            if (typeof navigator.vibrate === 'function') {
                navigator.vibrate(40);
            }
        } else {
            // Wrong step - could flash red here in future
            if (typeof navigator.vibrate === 'function') {
                navigator.vibrate([100, 50, 100]);
            }
        }
    };

    return (
        <PageWrapper className="!pb-0 !px-0 bg-black min-h-dvh flex flex-col relative overflow-hidden">
            {/* Header / Score */}
            <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <button
                    onClick={() => navigate('/activities')}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white z-50 relative"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                    <p className="text-[10px] text-pink-400 font-bold uppercase tracking-widest leading-none mb-1">Live XP</p>
                    <p className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{score}</p>
                </div>
                <div className="w-10"></div>
            </div>

            {/* Neon Grid Background (Static but animates slightly to feel alive) */}
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
                                layout // <--- This triggers the smooth falling animation when the array changes
                                initial={{ opacity: 0, y: -50 }} // enter from top
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50, scale: 0.9 }} // exit at bottom
                                transition={{ type: "spring", stiffness: 600, damping: 40 }}
                                className="w-full flex"
                                style={{ height: '16.666%' }} // Exactly 6 rows fit
                            >
                                {[0, 1, 2, 3].map(col => {
                                    const isTarget = row.activeCol === col;
                                    return (
                                        <div
                                            key={col}
                                            className="flex-1 p-[4px] relative flex items-center justify-center cursor-pointer"
                                            // Handle fast taps/clicks anywhere in the lane box
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
                                                    {/* Inner glass highlight */}
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
