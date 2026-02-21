import { motion } from "framer-motion";
import { Crown, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import apiService from "../services/apiService";

const containerVariants = {
    animate: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function Leaderboard() {
    const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const data = await apiService.getGlobalLeaderboard(20);
            setGlobalLeaderboard(data.leaderboard);
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setLoading(false);
        }
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

    const rank1 = globalLeaderboard[0];
    const rank2 = globalLeaderboard[1];
    const rank3 = globalLeaderboard[2];
    const rest = globalLeaderboard.slice(3);
    const maxXP = rank1?.total_xp || 1;

    const getMedalEmoji = (rank) => {
        switch(rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return '🎖️';
        }
    };

    const getAvatarColor = (rank) => {
        switch(rank) {
            case 1: return 'from-yellow-200 via-yellow-400 to-yellow-600';
            case 2: return 'from-gray-100 via-gray-300 to-gray-500';
            case 3: return 'from-amber-300 via-amber-500 to-amber-700';
            default: return 'from-blue-200 via-blue-400 to-blue-600';
        }
    };

    const getBorderColor = (rank) => {
        switch(rank) {
            case 1: return 'border-yellow-400/40';
            case 2: return 'border-gray-300/30';
            case 3: return 'border-amber-600/30';
            default: return 'border-[var(--color-border)]';
        }
    };

    const getGradientBg = (rank) => {
        switch(rank) {
            case 1: return 'from-yellow-500/10 to-transparent';
            case 2: return 'from-gray-400/10 to-transparent';
            case 3: return 'from-amber-600/10 to-transparent';
            default: return 'to-transparent';
        }
    };

    const renderTopRank = (leader, position) => {
        if (!leader) return null;
        
        const isGold = position === 1;
        const isSilver = position === 2;
        const isBronze = position === 3;
        
        return (
            <motion.div 
                key={leader.rank}
                variants={itemVariants} 
                className="mb-6 relative"
            >
                {isGold && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 rounded-[2rem] blur opacity-25 animate-pulse" />
                )}
                <div className={`relative glass-card p-6 flex flex-col items-center border-2 ${getBorderColor(position)} bg-gradient-to-b ${getGradientBg(position)}`}>
                    <div className="absolute top-4 left-4">
                        <span className="text-3xl drop-shadow-md">{getMedalEmoji(position)}</span>
                    </div>
                    {isGold && (
                        <div className="absolute top-4 right-4 text-yellow-400 animate-bounce">
                            <Crown className="w-8 h-8 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" strokeWidth={2.5} />
                        </div>
                    )}

                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getAvatarColor(position)} p-1 mb-4 shadow-lg`}>
                        <div className="w-full h-full rounded-full bg-[var(--color-bg-deep)] flex items-center justify-center border-2 border-[var(--color-bg-deep)]">
                            <span className="text-4xl font-black">
                                {leader.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">{leader.full_name || leader.username}</h2>
                    {position === 1 && (
                        <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-widest border border-yellow-500/30 mb-3 backdrop-blur-sm">
                            Best Performer
                        </span>
                    )}
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 drop-shadow-sm">
                        {leader.total_xp} <span className="text-sm font-bold text-yellow-500/80">XP</span>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <PageWrapper>
            <motion.div variants={containerVariants} initial="initial" animate="animate">
                <motion.div variants={itemVariants} className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-1 gradient-text">
                        Leaderboard
                    </h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Campus ranking all-time
                    </p>
                </motion.div>

                {/* Top 3 - Special presentation */}
                {rank1 && renderTopRank(rank1, 1)}

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {rank2 && (
                        <motion.div variants={itemVariants} className={`glass-card p-5 flex flex-col items-center border ${getBorderColor(2)} bg-gradient-to-b ${getGradientBg(2)} relative overflow-hidden`}>
                            <div className="absolute top-3 left-3 text-2xl drop-shadow-md">🥈</div>
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarColor(2)} p-0.5 mb-3 shadow-lg`}>
                                <div className="w-full h-full rounded-full bg-[var(--color-bg-deep)] flex items-center justify-center border border-[var(--color-bg-deep)]">
                                    <span className="text-2xl font-black">
                                        {rank2.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-base font-bold text-white truncate w-full text-center">{rank2.full_name || rank2.username}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Runner Up</p>
                            <div className="text-xl font-black text-gray-300">
                                {rank2.total_xp} <span className="text-xs font-bold text-gray-500">XP</span>
                            </div>
                        </motion.div>
                    )}

                    {rank3 && (
                        <motion.div variants={itemVariants} className={`glass-card p-5 flex flex-col items-center border ${getBorderColor(3)} bg-gradient-to-b ${getGradientBg(3)} relative overflow-hidden`}>
                            <div className="absolute top-3 left-3 text-2xl drop-shadow-md">🥉</div>
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarColor(3)} p-0.5 mb-3 shadow-lg`}>
                                <div className="w-full h-full rounded-full bg-[var(--color-bg-deep)] flex items-center justify-center border border-[var(--color-bg-deep)]">
                                    <span className="text-2xl font-black">
                                        {rank3.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-base font-bold text-white truncate w-full text-center">{rank3.full_name || rank3.username}</h3>
                            <p className="text-[10px] font-bold text-amber-600/80 uppercase tracking-widest mb-1.5">3rd Place</p>
                            <div className="text-xl font-black text-amber-500">
                                {rank3.total_xp} <span className="text-xs font-bold text-amber-700">XP</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Rest of the list */}
                {rest.length > 0 && (
                    <>
                        <h3 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                            <span className="w-full h-px bg-[var(--color-border)] flex-1"></span>
                            Campus Ranks
                            <span className="w-full h-px bg-[var(--color-border)] flex-1"></span>
                        </h3>

                        <div className="flex flex-col gap-3">
                            {rest.map((leader) => (
                                <motion.div
                                    key={leader.id}
                                    variants={itemVariants}
                                    className="glass-card p-4 flex items-center gap-4 hover:border-[var(--color-border-active)] transition-colors"
                                >
                                    <span className="text-sm font-bold text-[var(--color-text-muted)] w-6 text-center">
                                        #{leader.rank}
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center shrink-0 border border-[var(--color-border)]">
                                        <span className="text-sm font-black text-[var(--color-text-secondary)]">
                                            {leader.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[var(--color-text-primary)]">{leader.full_name || leader.username}</p>
                                        <div className="mt-2 w-full h-1.5 bg-[var(--color-bg-deep)] rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(leader.total_xp / maxXP) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                                className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-[var(--color-text-primary)]">{leader.total_xp} <span className="text-[10px] text-[var(--color-text-muted)] font-bold">XP</span></span>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </motion.div>
        </PageWrapper>
    );
}
