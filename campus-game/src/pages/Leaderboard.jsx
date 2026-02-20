import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import PageWrapper from "../components/PageWrapper";

const leaders = [
    { rank: 1, name: "Arjun M.", xp: 4820, avatar: "A", role: "Best Performer" },
    { rank: 2, name: "Sneha R.", xp: 4310, avatar: "S" },
    { rank: 3, name: "Rahul K.", xp: 3980, avatar: "R" },
    { rank: 4, name: "Priya S.", xp: 3650, avatar: "P" },
    { rank: 5, name: "Deepak V.", xp: 3420, avatar: "D" },
    { rank: 6, name: "Ananya B.", xp: 3100, avatar: "A" },
    { rank: 7, name: "Karthik N.", xp: 2890, avatar: "K" },
    { rank: 8, name: "Meera L.", xp: 2650, avatar: "M" },
];

const containerVariants = {
    animate: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function Leaderboard() {
    const maxXP = leaders[0].xp;

    const rank1 = leaders[0];
    const rank2 = leaders[1];
    const rank3 = leaders[2];
    const rest = leaders.slice(3);

    return (
        <PageWrapper>
            <motion.div variants={containerVariants} initial="initial" animate="animate">
                <motion.div variants={itemVariants} className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-1 gradient-text">
                        Leaderboard
                    </h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Campus ranking this week
                    </p>
                </motion.div>

                {/* Best Performer (Gold) */}
                <motion.div variants={itemVariants} className="mb-6 relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 rounded-[2rem] blur opacity-25 animate-pulse-glow" />
                    <div className="relative glass-card p-6 flex flex-col items-center border-2 border-yellow-400/40 bg-gradient-to-b from-yellow-500/10 to-transparent">
                        <div className="absolute top-4 left-4">
                            <span className="text-3xl drop-shadow-md">🥇</span>
                        </div>
                        <div className="absolute top-4 right-4 text-yellow-400 animate-bounce">
                            <Crown className="w-8 h-8 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" strokeWidth={2.5} />
                        </div>

                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 p-1 mb-4 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                            <div className="w-full h-full rounded-full bg-[var(--color-bg-deep)] flex items-center justify-center border-2 border-[var(--color-bg-deep)]">
                                <span className="text-4xl font-black bg-gradient-to-br from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                                    {rank1.avatar}
                                </span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">{rank1.name}</h2>
                        <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-widest border border-yellow-500/30 mb-3 backdrop-blur-sm">
                            {rank1.role}
                        </span>
                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 drop-shadow-sm">
                            {rank1.xp} <span className="text-sm font-bold text-yellow-500/80">XP</span>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Rank 2 (Silver) */}
                    <motion.div variants={itemVariants} className="glass-card p-5 flex flex-col items-center border border-gray-300/30 bg-gradient-to-b from-gray-400/10 to-transparent relative overflow-hidden">
                        <div className="absolute top-3 left-3 text-2xl drop-shadow-md">🥈</div>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 via-gray-300 to-gray-500 p-0.5 mb-3 shadow-[0_0_15px_rgba(209,213,219,0.2)]">
                            <div className="w-full h-full rounded-full bg-[var(--color-bg-deep)] flex items-center justify-center border border-[var(--color-bg-deep)]">
                                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-200 to-gray-400">
                                    {rank2.avatar}
                                </span>
                            </div>
                        </div>
                        <h3 className="text-base font-bold text-white truncate w-full text-center">{rank2.name}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Runner Up</p>
                        <div className="text-xl font-black text-gray-300">
                            {rank2.xp} <span className="text-xs font-bold text-gray-500">XP</span>
                        </div>
                    </motion.div>

                    {/* Rank 3 (Bronze) */}
                    <motion.div variants={itemVariants} className="glass-card p-5 flex flex-col items-center border border-amber-600/30 bg-gradient-to-b from-amber-600/10 to-transparent relative overflow-hidden">
                        <div className="absolute top-3 left-3 text-2xl drop-shadow-md">🥉</div>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 mb-3 shadow-[0_0_15px_rgba(217,119,6,0.2)]">
                            <div className="w-full h-full rounded-full bg-[var(--color-bg-deep)] flex items-center justify-center border border-[var(--color-bg-deep)]">
                                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-amber-600">
                                    {rank3.avatar}
                                </span>
                            </div>
                        </div>
                        <h3 className="text-base font-bold text-white truncate w-full text-center">{rank3.name}</h3>
                        <p className="text-[10px] font-bold text-amber-600/80 uppercase tracking-widest mb-1.5">3rd Place</p>
                        <div className="text-xl font-black text-amber-500">
                            {rank3.xp} <span className="text-xs font-bold text-amber-700">XP</span>
                        </div>
                    </motion.div>
                </div>

                {/* Rest of the list */}
                <h3 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                    <span className="w-full h-px bg-[var(--color-border)] flex-1"></span>
                    Campus Ranks
                    <span className="w-full h-px bg-[var(--color-border)] flex-1"></span>
                </h3>

                <div className="flex flex-col gap-3">
                    {rest.map((leader) => (
                        <motion.div
                            key={leader.rank}
                            variants={itemVariants}
                            className="glass-card p-4 flex items-center gap-4 hover:border-[var(--color-border-active)] transition-colors"
                        >
                            <span className="text-sm font-bold text-[var(--color-text-muted)] w-6 text-center">
                                #{leader.rank}
                            </span>
                            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center shrink-0 border border-[var(--color-border)]">
                                <span className="text-sm font-black text-[var(--color-text-secondary)]">
                                    {leader.avatar}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[var(--color-text-primary)]">{leader.name}</p>
                                <div className="mt-2 w-full h-1.5 bg-[var(--color-bg-deep)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(leader.xp / maxXP) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                                    />
                                </div>
                            </div>
                            <span className="text-sm font-black text-[var(--color-text-primary)]">{leader.xp} <span className="text-[10px] text-[var(--color-text-muted)] font-bold">XP</span></span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </PageWrapper>
    );
}
