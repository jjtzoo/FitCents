import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body.auth || {};

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        const user = await User.findOne({ "auth.username" : username.trim().toLowerCase() });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.auth.passwordHash);
        if(!isMatch) {
            return res.status(401).json({ error: "Invalid credentials."});
        }

        req.session.user = {
            _id: user._id,
            auth: {
                username: user.auth.username,
                email: user.auth.email,
            },
            role: user.role,
        };

        const safeUser = {
            _id: user._id,
            auth: {
                username: user.auth.username,
                email: user.auth.email,
            },
            role: user.role
        };

        req.session.save(err => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ error: "Failed to create session." });
            }

            res.status(200).json({ message: "Login Successfully", user: safeUser });
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal Server Error."})
    }
};

export const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Logout Failed."});
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully"});
    })
};