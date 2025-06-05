const connectDB = require("./mongoose");
const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});

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

