import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
    const { username, password } = req.body.auth;

    try {
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

        res.status(200).json({ message: "Login Succesfully, ", user: safeUser })
    } catch (err) {
        console.log("Error: ", err);
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