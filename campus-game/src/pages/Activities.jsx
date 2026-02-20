import { motion } from "framer-motion";
import { Footprints, Dumbbell, Bike, PersonStanding } from "lucide-react";
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
    return (
        <PageWrapper>
            <motion.div variants={containerVariants} initial="initial" animate="animate">
                <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-1 gradient-text">
                    Activities
                </motion.h1>
                <motion.p variants={itemVariants} className="text-sm text-[var(--color-text-secondary)] mb-6">
                    Log a campus activity to earn XP
                </motion.p>

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
