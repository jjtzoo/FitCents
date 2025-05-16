const UserMeals = require("../models/userMeals");
const UserGoals = require("../models/userGoals");
const UserData = require("../models/userData");
const Recipes = require("../models/recipes")


exports.generateUserMeals = async(req, res) => {
    try {
        const userId = req.params.id;

        const user = await UserData.findById(userId);
        const goals = await UserGoals.findOne({ user: userId});

        if (!user || !goals) {
            return res.status(404).json({ error: "User or goals not found."})
        }

        const recipes = await Recipes.find({
            calories: {$lte : goals.kcalPerMeal},
            cost : {$lte : goals.costPerMeal},
            tags: {$in: user.preference}
        })

        if (recipes.length === 0) {
            return res.status(404).json({error: "No matching recipes found"});
        }

        const meals = [];
        for (let i = 0; i < goals.totalMeals; i++) {
            const recipe = recipes[Math.floor(Math.random() * recipes.length)];
            meals.push({
                user:userId,
                recipe: recipe._id,
                day: Math.floor(i / user.mealsPerDay),
                mealNumber : (i % user.mealsPerDay) + 1,
            })
        }

        const savedMeals = await UserMeals.insertMany(meals);

        res.status(201).json({
            message: "User meals generated successfully",
            meals: savedMeals,
        });

    } catch(err) {
        console.error("Meal Generation error:", err);
        res.status(500).json({error : "Internal Server Error"});
    }
}