import { Activity, Flame, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";

const quickStats = [
    { icon: Flame, label: "Streak", value: "7 days", color: "text-[var(--color-warning)]" },
    { icon: Zap, label: "XP Today", value: "340", color: "text-[var(--color-accent)]" },
    { icon: TrendingUp, label: "Rank", value: "#12", color: "text-[var(--color-primary-light)]" },
];

const containerVariants = {
    animate: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function Home() {
    return (
        <PageWrapper>
            <motion.div variants={containerVariants} initial="initial" animate="animate">
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8">
                    <p className="text-[var(--color-text-secondary)] text-sm font-medium">Welcome back 👋</p>
                    <h1 className="text-6xl font-bold mt-1">
                        <span className="gradient-text">Nadakkadi Sheele</span>
                    </h1>
                </motion.div>

                {/* Quick Stats */}
                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-10">
                    {quickStats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="glass-card p-4 text-center">
                                <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                                <p className="text-lg font-bold text-[var(--color-text-primary)]">{stat.value}</p>
                                <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">
                                    {stat.label}
                                </p>
                            </div>
                        );
                    })}
                </motion.div>

                {/* Progress Bar Container */}
                <motion.div variants={itemVariants} className="glass-card p-6 mb-6 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Walk 5,000 steps</h2>
                    <div className="w-full h-2.5 bg-[var(--color-bg-deep)] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "68%" }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                            className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                        />
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-2">3,400 / 5,000 steps</p>
                </motion.div>

                {/* Recent Activity Placeholder */}
                <motion.div variants={itemVariants}>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
                        Recent Activity
                    </h3>
                    {["Climbed 3 flights of stairs", "Walked to Library", "Morning jog around campus"].map(
                        (activity, i) => (
                            <div
                                key={i}
                                className="glass-card p-4 mb-3 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-dim)] flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-[var(--color-accent)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{activity}</p>
                                        <p className="text-[10px] text-[var(--color-text-muted)]">2h ago</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-[var(--color-accent)]">+{(i + 1) * 25} XP</span>
                            </div>
                        )
                    )}
                </motion.div>
            </motion.div >
        </PageWrapper >
    );
}
