const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const recipes = require("./recipesRoute");
const userData = require("./recipesRoute");
const userGoals = require("./userGoalsRoute");
const userMeals = require("./userMealsRoute");
const meatPart = require("./meatPartsRoute")

const app = express();
const PORT = 3001;


app.use(cors());
app.use(express.json());
app.use(recipes);
app.use(userData);
app.use(userGoals);
app.use(userMeals);
app.use(meatPart);

app.listen(PORT, () => {
    connect.connectToServer();
    console.log(`Server is running on port ${PORT}`);
});

