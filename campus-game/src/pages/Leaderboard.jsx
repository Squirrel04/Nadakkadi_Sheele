import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import PageWrapper from "../components/PageWrapper";

const leaders = [
    { rank: 1, name: "Arjun M.", xp: 4820, icon: Trophy, color: "text-yellow-400", badge: "🥇" },
    { rank: 2, name: "Sneha R.", xp: 4310, icon: Medal, color: "text-gray-300", badge: "🥈" },
    { rank: 3, name: "Rahul K.", xp: 3980, icon: Award, color: "text-amber-600", badge: "🥉" },
    { rank: 4, name: "Priya S.", xp: 3650 },
    { rank: 5, name: "Deepak V.", xp: 3420 },
    { rank: 6, name: "Ananya B.", xp: 3100 },
    { rank: 7, name: "Karthik N.", xp: 2890 },
    { rank: 8, name: "Meera L.", xp: 2650 },
];

const containerVariants = {
    animate: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
    initial: { opacity: 0, x: -16 },
    animate: { opacity: 1, x: 0 },
};

export default function Leaderboard() {
    const maxXP = leaders[0].xp;

    return (
        <PageWrapper>
            <motion.div variants={containerVariants} initial="initial" animate="animate">
                <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-1 gradient-text">
                    Leaderboard
                </motion.h1>
                <motion.p variants={itemVariants} className="text-sm text-[var(--color-text-secondary)] mb-6">
                    Campus ranking this week
                </motion.p>

                {/* Top 3 Podium */}
                <motion.div variants={itemVariants} className="flex justify-center items-end gap-3 mb-8">
                    {leaders.slice(0, 3).map((leader, idx) => {
                        const heights = ["h-28", "h-24", "h-20"];
                        const order = [1, 0, 2]; // 2nd, 1st, 3rd
                        const podiumIdx = order[idx];
                        return (
                            <div key={leader.rank} className={`flex flex-col items-center ${idx === 0 ? "order-2" : idx === 1 ? "order-1" : "order-3"}`}>
                                <span className="text-2xl mb-1">{leader.badge}</span>
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center mb-2">
                                    <span className="text-sm font-bold text-[var(--color-bg-deep)]">
                                        {leader.name.charAt(0)}
                                    </span>
                                </div>
                                <p className="text-xs font-semibold text-[var(--color-text-primary)] mb-1 text-center truncate w-16">
                                    {leader.name}
                                </p>
                                <p className="text-[10px] text-[var(--color-accent)] font-bold mb-2">{leader.xp} XP</p>
                                <div className={`w-16 ${heights[podiumIdx]} rounded-t-xl bg-gradient-to-t from-[var(--color-bg-surface)] to-[var(--color-bg-elevated)] border border-[var(--color-border)]`} />
                            </div>
                        );
                    })}
                </motion.div>

                {/* Rest of the list */}
                {leaders.slice(3).map((leader) => (
                    <motion.div
                        key={leader.rank}
                        variants={itemVariants}
                        className="glass-card p-4 mb-3 flex items-center gap-4"
                    >
                        <span className="text-sm font-bold text-[var(--color-text-muted)] w-6 text-center">
                            {leader.rank}
                        </span>
                        <div className="w-9 h-9 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-[var(--color-text-secondary)]">
                                {leader.name.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">{leader.name}</p>
                            <div className="mt-1.5 w-full h-1.5 bg-[var(--color-bg-deep)] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(leader.xp / maxXP) * 100}%` }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                                />
                            </div>
                        </div>
                        <span className="text-xs font-bold text-[var(--color-text-secondary)]">{leader.xp} XP</span>
                    </motion.div>
                ))}
            </motion.div>
        </PageWrapper>
    );
}
