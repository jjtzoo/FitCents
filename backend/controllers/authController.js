import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
    const { username, password } = req.body.auth;

    try {
        const user = await User.findOne({ "auth.username" : username });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.auth.passwordHash);
        if(!isMatch) {
            return res.status(401).json({ error: "Invalid credentials."});
        }

        req.session.userId = user._id;
        res.status(200).json({ message: "Login Succesfully, ", user })
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ error: "Internal Server Error."})
    }
}