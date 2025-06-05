import connectDB from "./config/db.js"
import express from "express";
import cors from ("cors")

import dotEnv from "dotenv";

dotEnv.config();


const app = express();
const PORT = process.env.PORT || 3002


app.use(cors());
app.use(express.json());

connectDB();


app.get("/", (req, res) => {
    res.send("API is running. Use /recipes, /userData, etc.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});

