import { NavLink } from "react-router"

const AboutUs = () => {
    return (
        <div className="px-6 py-12 max-w-5xl mx-auto">
        <section className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Helping You Eat Smart, Stay Fit, and Spend Wisely.
            </h1>
            <p className="text-gray-600 text-lg">
            FitCents is your personal assistant for healthy, budget-friendly, and convenient meal planning.
            </p>
        </section>

        <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">What is FitCents?</h2>
            <p className="text-gray-700">
            FitCents is a personalized meal planning app that generates meals tailored to your nutritional needs, food preferences, and daily budget. Whether you're trying to lose weight, gain muscle, or just eat better without breaking the bank, FitCents helps you make smarter choices.
            </p>
        </section>

        <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Why We Built It</h2>
            <p className="text-gray-700">
            FitCents started as a passion project by <strong>Jorge Jacob Toledo</strong>—a mining engineer turned full-stack developer. I built this during coding bootcamp to solve a real-life problem I faced: how to eat right while staying within budget. This app reflects my growth, discipline, and deep desire to create something truly useful.
            </p>
        </section>

        <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What You Get</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 list-disc list-inside">
            <li>✅ Auto-generated meal plans based on your biometrics</li>
            <li>🛒 Grocery list builder</li>
            <li>🧂 Pantry tracker for condiments and long-lasting ingredients</li>
            <li>📊 Smart recommendations that evolve with your inputs</li>
            <li>💡 Real-time suggestions for premium users</li>
            <li>🧪 Full control and analytics for developer users</li>
            </ul>
        </section>

        <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Built With Love and Code</h2>
            <p className="text-gray-700">
            Built using the <strong>MERN stack</strong>, FitCents reflects a commitment to thoughtful design, clean code, and solving real-world problems. It's proof that with dedication and learning, anything can be built from the ground up.
            </p>
        </section>

        <section className="text-center mt-8">
            <p className="text-gray-700 text-lg mb-4">Ready to take control of your health and budget?</p>
            <div className="flex justify-center gap-4">
            <Link to="/register" className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">Register</Link>
            <Link to="/login" className="px-6 py-2 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 transition">Login</Link>
            </div>
        </section>
        </div>
    )
}

export default AboutUs
