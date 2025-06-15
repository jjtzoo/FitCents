import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { motion } from "framer-motion"

const LoginForm = () => {
    const navigate = useNavigate();
    const { setUser } = useUserContext();

    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ rememberMe, setRememberMe ] = useState(false);
    const [ errorMsg, setErrorMsg ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const res = await axios.post("http://localhost:4000/api/auth/login", {
                auth: {
                    username,
                    password,
                },
            });

            const user = res.data.user;
            console.log("✅ Login success: ", user);
            setUser(user);

            if(rememberMe) {
                localStorage.setItem("rememberedUser", JSON.stringify(user));
            } else {
                localStorage.removeItem("rememberedUser")
            }

            if (user.role === "developer") navigate("/dev-dashboard");
            else if (user.role === "premium") navigate("/premium-dashboard");
            else navigate("/dashboard")
        } catch (err) {
            const message = err.response?.data?.error || "Login failed. Try Again.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-10">
            <motion.form
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
            >
                <h2 className="text-3xl font-bold text-center text-amber-700">
                Login to FitCents
                </h2>

                {errorMsg && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm text-center"
                >
                    {errorMsg}
                </motion.p>
                )}

                <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Username
                </label>
                <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>

                <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>

                <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4"
                />
                <label className="text-sm text-gray-600">Remember Me</label>
                </div>

                <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                >
                {loading ? "Logging in..." : "Login"}
                </button>
            </motion.form>
        </main>
    )
}

export default LoginForm;