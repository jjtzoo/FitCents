import { motion } from "framer-motion"

const AppHeader = () => {
    return (
        <motion.h1
            className="app-header flex items-center gap-2 text-primary-700 font-display text-xl sm:text-2xl font-bold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.05 }}
        >
            <img src="/favicon.svg" alt="FitCents logo" className="w-6 h-6 sm:w-7 sm:h-7 rounded-md" />
            <span>Fit Cents</span>
        </motion.h1>
    )
}

export default AppHeader
