import { Link, NavLink } from "react-router"
import { motion } from "framer-motion"


const HomeComponent = () => {
  return (
    <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4 py-10 text-center">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl font-extrabold text-amber-700 mb-4 font-[Bebas Neue]">
          Eat Smart. Stay Fit. Spend Wisely.
        </h1>
        <p className="text-lg text-gray-700 mb-6">
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
        <Link
          to="/register"
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
        >
          Login
        </Link>
      </motion.div>

      {/* Learn More Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-gray-600"
      >
        Want to know more about us?{" "}
        <NavLink
          to="/aboutus"
          className={({ isActive }) =>
            isActive
              ? "underline text-amber-700 font-medium"
              : "underline text-gray-600 hover:text-amber-700 transition"
          }
        >
          Learn more
        </NavLink>
      </motion.p>
    </main>
  )
}

export default HomeComponent
