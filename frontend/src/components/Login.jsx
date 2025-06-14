import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const Login = () => {
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
            const res = await axios.post("/api/auth/login", {
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
        <form
        onSubmit={handleLogin}
        className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6"
        >
            <h2 className="text-2xl font-bold text-center">Login</h2>

            {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
            )}

            <div className="space-y-2">
                <label className="block text-sm font-medium">Username</label>
                <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4"
                />
                <label className="text-sm">Remember Me</label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    )
}

export default Login;