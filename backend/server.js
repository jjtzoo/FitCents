const connectDB = require("./mongoose");
const express = require("express");
const cors = require("cors");
const recipes = require("./route/recipesRoute");
const userData = require("./route/recipesRoute");
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

app.use("/recipes",recipes);
app.use("/userData", userData);
app.use("/userGoals", userGoals);
app.use("/userMeals", userMeals);
app.use("/meatParts", meatParts);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});

