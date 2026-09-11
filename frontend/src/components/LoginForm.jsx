import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { motion } from "framer-motion"
import Card from "./ui/Card";
import Input from "./ui/Input";
import Button from "./ui/Button";

const apiURL = import.meta.env.VITE_API_BASE_URL;

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
            const res = await axios.post(`${apiURL}/api/auth/login`, {
                auth: {
                    username,
                    password,
                },
            }, {
                withCredentials: true
            }
        );

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
        <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-10">
            <motion.form
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                onSubmit={handleLogin}
                className="w-full max-w-md"
            >
                <Card className="space-y-6" padding="p-8">
                    <h2 className="text-3xl font-display font-bold text-center text-primary-700">
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

                    <Input
                        label="Username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <Input
                        label="Password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 accent-primary-600"
                        />
                        <label className="text-sm text-stone-600">Remember Me</label>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </Card>
            </motion.form>
        </main>
    )
}

export default LoginForm;
