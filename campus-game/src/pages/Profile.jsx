import { motion } from "framer-motion";
import { User, LogOut, Settings, Bell, ChevronRight } from "lucide-react";
import PageWrapper from "../components/PageWrapper";

const menuItems = [
    { icon: Bell, label: "Notifications", id: "notifications" },
    { icon: Settings, label: "Settings", id: "settings" },
    { icon: LogOut, label: "Log Out", id: "logout" },
];

const containerVariants = {
    animate: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function Profile() {
    return (
        <PageWrapper>
            <motion.div variants={containerVariants} initial="initial" animate="animate">
                <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-6 gradient-text">
                    Profile
                </motion.h1>

                {/* Avatar & Info */}
                <motion.div variants={itemVariants} className="glass-card p-6 flex items-center gap-5 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shrink-0 animate-pulse-glow">
                        <User className="w-8 h-8 text-[var(--color-bg-deep)]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Student</h2>
                        <p className="text-xs text-[var(--color-text-muted)]">Campus Explorer</p>
                    </div>
                </motion.div>

                {/* Stats Row */}
                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { label: "Total XP", value: "12,480" },
                        { label: "Activities", value: "87" },
                        { label: "Best Streak", value: "14d" },
                    ].map((stat) => (
                        <div key={stat.label} className="glass-card p-4 text-center">
                            <p className="text-lg font-bold text-[var(--color-text-primary)]">{stat.value}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>

                {/* Menu Items */}
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <motion.button
                            key={item.id}
                            variants={itemVariants}
                            whileTap={{ scale: 0.97 }}
                            className="w-full glass-card p-4 mb-3 flex items-center gap-4 text-left
                         cursor-pointer transition-all duration-200 hover:border-[var(--color-border-active)]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                            id={`profile-${item.id}`}
                        >
                            <Icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                            <span className="flex-1 text-sm font-medium text-[var(--color-text-primary)]">{item.label}</span>
                            <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                        </motion.button>
                    );
                })}
            </motion.div>
        </PageWrapper>
    );
}
