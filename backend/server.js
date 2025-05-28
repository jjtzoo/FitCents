const connectDB = require("./mongoose");
const express = require("express");
const cors = require("cors");
const recipes = require("./route/recipesRoute");
const userData = require("./route/userDataRoute");
const userGoals = require("./route/userGoalsRoute");
const userMeals = require("./route/userMealsRoute");
const meatParts = require("./route/meatPartsRoute");
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});

const app = express();
const PORT = process.env.PORT || 3002


app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/recipes",recipes);
app.use("/api/userData", userData);
app.use("/api/userGoals", userGoals);
app.use("/api/userMeals", userMeals);
app.use("/api/meatParts", meatParts);

app.get("/", (req, res) => {
    res.send("API is running. Use /recipes, /userData, etc.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});

