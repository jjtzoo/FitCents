import { Link } from "react-router"
import { motion } from "framer-motion"
import Button from "./ui/Button"

const sectionTitle = "text-2xl font-display font-bold text-stone-800 mb-3"

const AboutUsContent = () => {
    return (
        <div className="px-6 py-12 max-w-5xl mx-auto space-y-12">
        <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
        >
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900 mb-4">
            Helping You Eat Smart, Stay Fit, and Spend Wisely.
            </h1>
            <p className="text-stone-600 text-lg">
            FitCents is your personal assistant for healthy, budget-friendly, and convenient meal planning.
            </p>
        </motion.section>

        <motion.section
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <h2 className={sectionTitle}>What is FitCents?</h2>
            <p className="text-stone-600">
            FitCents is a personalized meal planning app that generates meals tailored to your nutritional needs, food preferences, and daily budget.
            Whether you're trying to lose weight, gain muscle, or just eat better without breaking the bank, FitCents helps you make smarter choices.
            </p>
        </motion.section>

        {/* Why We Built It */}
        <motion.section
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <h2 className={sectionTitle}>Why We Built It</h2>
            <p className="text-stone-600">
            FitCents started as a passion project by <strong>Jorge Jacob Toledo</strong> — a mining engineer turned full-stack developer.
            I built this during coding bootcamp to solve a real-life problem I faced: how to eat right while staying within budget.
            This app reflects my growth, discipline, and deep desire to create something truly useful.
            </p>
        </motion.section>

        {/* Core Features */}
        <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            <h2 className={sectionTitle}>What You Get</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-stone-600 list-disc list-inside">
                <li>✅ Auto-generated meal plans based on your biometrics</li>
                <li>🛒 Grocery list builder</li>
                <li>🧂 Pantry tracker for condiments and long-lasting ingredients</li>
                <li>📊 Smart recommendations that evolve with your inputs</li>
                <li>💡 Real-time suggestions for premium users</li>
                <li>🧪 Full control and analytics for developer users</li>
            </ul>
        </motion.section>

        {/* Footer */}
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
            <h2 className={sectionTitle}>Built With Love and Code</h2>
            <p className="text-stone-600 mb-4">
            Built using the <strong>MERN stack</strong>, FitCents reflects a commitment to thoughtful design, clean code, and solving real-world problems.
            It's proof that with dedication and learning, anything can be built from the ground up.
            </p>
            <div className="text-center mt-6">
            <p className="text-stone-600 text-lg mb-4">
                Ready to take control of your health and budget?
            </p>
            <div className="flex justify-center gap-4">
                <Link to="/register">
                    <Button variant="primary">Register</Button>
                </Link>
                <Link to="/login">
                    <Button variant="outline">Login</Button>
                </Link>
            </div>
            </div>
        </motion.section>
    </div>
    )
}

export default AboutUsContent
