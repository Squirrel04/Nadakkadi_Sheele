import { motion } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
};

export default function PageWrapper({ children, className = "" }) {
    return (
        <motion.main
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`min-h-dvh pb-28 px-4 pt-6 mx-auto ${className}`}
        >
            {children}
        </motion.main>
    );
}
