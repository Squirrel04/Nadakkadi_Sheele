import { motion } from "framer-motion";
import { Footprints, Dumbbell, Bike, PersonStanding, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const activities = [
    { icon: Footprints, name: "Walking", xp: "10 XP / 100 steps", color: "text-[var(--color-accent)]", bg: "bg-[var(--color-accent-dim)]" },
    { icon: PersonStanding, name: "Stair Climbing", xp: "25 XP / flight", color: "text-[var(--color-warning)]", bg: "bg-yellow-500/10" },
    { icon: Bike, name: "Cycling", xp: "15 XP / min", color: "text-[var(--color-info)]", bg: "bg-blue-500/10" },
    { icon: Dumbbell, name: "Gym Workout", xp: "30 XP / session", color: "text-[var(--color-danger)]", bg: "bg-red-500/10" },
];

const containerVariants = {
    animate: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function Activities() {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <motion.div variants={containerVariants} initial="initial" animate="animate">
                <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-1 gradient-text">
                    Activities
                </motion.h1>
                <motion.p variants={itemVariants} className="text-sm text-[var(--color-text-secondary)] mb-6">
                    Log a campus activity to earn XP
                </motion.p>

                {/* START LIVE GAME CTA */}
                <motion.button
                    variants={itemVariants}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate('/play')}
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
                            Start Live Game
                        </h2>
                        <p className="text-xs text-pink-300/80 mt-1 font-medium relative z-10 uppercase tracking-widest text-center">
                            Jump on the pink tiles!
                        </p>
                    </div>
                </motion.button>

                <motion.h3 variants={itemVariants} className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                    <span className="w-full h-px bg-[var(--color-border)] flex-1"></span>
                    Manual Logs
                    <span className="w-full h-px bg-[var(--color-border)] flex-1"></span>
                </motion.h3>

                {activities.map((act) => {
                    const Icon = act.icon;
                    return (
                        <motion.button
                            key={act.name}
                            variants={itemVariants}
                            whileTap={{ scale: 0.97 }}
                            className="w-full glass-card p-5 mb-3 flex items-center gap-4 text-left
                         transition-all duration-200 hover:border-[var(--color-border-active)]
                         cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                            id={`activity-${act.name.toLowerCase().replace(/\s/g, "-")}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl ${act.bg} flex items-center justify-center shrink-0`}>
                                <Icon className={`w-6 h-6 ${act.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[var(--color-text-primary)]">{act.name}</p>
                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{act.xp}</p>
                            </div>
                            <span className="text-[var(--color-text-muted)] text-lg">›</span>
                        </motion.button>
                    );
                })}
            </motion.div>
        </PageWrapper>
    );
}
