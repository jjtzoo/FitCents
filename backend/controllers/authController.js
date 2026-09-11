import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

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

export const guestLogin = async (req, res) => {
    try {
        const suffix = crypto.randomBytes(4).toString("hex");
        const username = `guest_${suffix}`;
        const passwordHash = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);

        const guestUser = new User({
            auth: {
                username,
                email: `${username}@guest.fitcents.local`,
                passwordHash,
            },
            role: "regular",
            isGuest: true,
        });

        await guestUser.save();

        req.session.user = {
            _id: guestUser._id,
            auth: {
                username: guestUser.auth.username,
                email: guestUser.auth.email,
            },
            role: guestUser.role,
        };

        const safeUser = {
            _id: guestUser._id,
            auth: {
                username: guestUser.auth.username,
                email: guestUser.auth.email,
            },
            role: guestUser.role,
            isGuest: true,
        };

        req.session.save(err => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ error: "Failed to create guest session." });
            }

            res.status(201).json({ message: "Guest session started", user: safeUser });
        });
    } catch (err) {
        console.error("Guest login error:", err);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Logout Failed."});
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully"});
    })
};