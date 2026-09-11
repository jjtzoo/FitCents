import { useState } from 'react'
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion'
import axios from 'axios'
import { useUserContext } from '../context/UserContext';

const apiURL = import.meta.env.VITE_API_BASE_URL;

const RegistrationForm = () => {
    const navigate = useNavigate();
    const { setUser } = useUserContext();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMsg("Username and password are required.");
            return;
        }

        setLoading(true);
        setErrorMsg("");

        try {
            const response = await axios.post(`${apiURL}/api/users/register`, {
                auth: { username, password }
            }, { withCredentials: true });

            setUser(response.data.user ?? response.data);
            navigate("/dashboard/user");
        } catch (err) {
            const message = err.response?.data?.error || "Something went wrong.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGuest = async () => {
        setLoading(true);
        setErrorMsg("");

        try {
            const response = await axios.post(`${apiURL}/api/auth/guest`, {}, {
                withCredentials: true,
            });

            setUser(response.data.user);
            navigate("/dashboard/user");
        } catch (err) {
            const message = err.response?.data?.error || "Could not start a guest session.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-10">
            <motion.form
                onSubmit={handleRegister}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
            >
                <h2 className="text-3xl font-bold text-center text-amber-700">
                    Create your FitCents account
                </h2>

                {errorMsg && (
                    <p className="text-red-500 text-sm text-center">{errorMsg}</p>
                )}

                <div className="space-y-1">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-amber-500 text-white font-semibold rounded-md shadow-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                    {loading ? "Creating account..." : "Register"}
                </button>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex-1 h-px bg-gray-200" />
                    or
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                <button
                    type="button"
                    onClick={handleGuest}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-amber-300 text-amber-700 font-semibold rounded-md hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                    Continue as Guest
                </button>

                <p className="text-xs text-center text-gray-400">
                    You can fill in your body stats and preferences after you log in.
                </p>
            </motion.form>
        </main>
    )
}

export default RegistrationForm
