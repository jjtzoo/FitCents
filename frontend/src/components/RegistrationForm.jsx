import { useState } from 'react'
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion'
import axios from 'axios'
import { useUserContext } from '../context/UserContext';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

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
        <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-10">
            <motion.form
                onSubmit={handleRegister}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="space-y-6" padding="p-8">
                    <h2 className="text-3xl font-display font-bold text-center text-primary-700 text-balance">
                        Create your FitCents account
                    </h2>

                    {errorMsg && (
                        <p className="text-red-600 text-sm text-center">{errorMsg}</p>
                    )}

                    <Input
                        label="Username"
                        type="text"
                        id="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <Input
                        label="Password"
                        type="password"
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Creating account..." : "Register"}
                    </Button>

                    <div className="flex items-center gap-3 text-xs text-stone-400">
                        <div className="flex-1 h-px bg-stone-200" />
                        or
                        <div className="flex-1 h-px bg-stone-200" />
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleGuest}
                        disabled={loading}
                        className="w-full"
                    >
                        Continue as Guest
                    </Button>

                    <p className="text-xs text-center text-stone-400">
                        You can fill in your body stats and preferences after you log in.
                    </p>
                </Card>
            </motion.form>
        </main>
    )
}

export default RegistrationForm
