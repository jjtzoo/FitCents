import { MdSportsGymnastics } from "react-icons/md";
import { FaCentSign } from "react-icons/fa6";
import { Link } from "react-router";
import { motion } from "framer-motion"

const AppHeader = () => {
    return (
        <motion.h1
            className="app-header flex items-center gap-1 text-amber-700 text-xl sm:text-2xl font-bold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.05 }}
        >
            <span className="app-name-fit flex items-center gap-1">
                <MdSportsGymnastics className="text-blue-600" />
                Fit
            </span>
            <span className="app-name-cents flex items-center gap-1">
                Cents <FaCentSign className="text-blue-600" />
            </span>
        </motion.h1>
    )
}

export default AppHeader
