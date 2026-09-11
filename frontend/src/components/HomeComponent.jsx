import { NavLink } from "react-router"
import { motion } from "framer-motion"
import Button from "./ui/Button"

const HomeComponent = () => {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-10 text-center">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-primary-700 mb-4 text-balance">
          Eat Smart. Stay Fit. Spend Wisely.
        </h1>
        <p className="text-lg text-stone-600 mb-6 text-balance">
          FitCents helps you plan meals based on your biometrics, food preferences, and daily budget.
          No stress. Just better food decisions powered by smart data.
        </p>
      </motion.section>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
      >
        <NavLink to="/register">
          <Button variant="primary" size="lg">Get Started</Button>
        </NavLink>
        <NavLink to="/login">
          <Button variant="outline" size="lg">Login</Button>
        </NavLink>
      </motion.div>

      {/* Learn More Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-stone-500"
      >
        Want to know more about us?{" "}
        <NavLink
          to="/aboutus"
          className={({ isActive }) =>
            isActive
              ? "underline text-primary-700 font-medium"
              : "underline text-stone-500 hover:text-primary-700 transition"
          }
        >
          Learn more
        </NavLink>
      </motion.p>
    </main>
  )
}

export default HomeComponent
