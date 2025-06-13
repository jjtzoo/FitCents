import connectDB from "./config/db.js"
import session from "express-session";
import mongoStore from "connect-mongo";
import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js"
import authRoute from "./routes/authRoute.js"
import recipeRoute from "./routes/recipeRoute.js"
import mealplanRoute from "./routes/mealPlanRoute.js"
import groceryRoute from "./routes/groceryListRoute.js"

import dotEnv from "dotenv";

dotEnv.config();


const app = express();
const PORT = process.env.PORT || 3002

connectDB();
app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized : false,
    store: mongoStore.create({
        mongoUrl: process.env.ATLAS_URI,
    }),
    cookie: {
        maxAge : 1000 * 60 * 60 * 24
    }
}))

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/recipes", recipeRoute);
app.use("/api/meal-plan", mealplanRoute);
app.use("/api/grocerylist", groceryRoute);




app.get("/", (req, res) => {
    res.send("API is running. Use /recipes, /userData, etc.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});

