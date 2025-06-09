import recipeModel from "../models/recipeModel.js"

export const createRecipes = async (req, res) => {
    try {
        const recipe = req.body

        const totalCalories = recipe.ingredients.reduce((total, ingredient) => {
            return total + (ingredient.calories || 0);
        }, 0);

        const totalMealCost = recipe.ingredients.reduce((total, ingredient) => {
            return total + (ingredient.cost || 0);
        }, 0);

        const newRecipe = new recipeModel({
            ...recipe,
            caloriesPerServing : totalCalories,
            totalMealCost
        })

        await newRecipe.save();
    } catch (err) {
        console.log("Error creating recipe.", err);
        res.status(500).json({ error: "Internal Server Error"});
    }
}

export const getRecipes = async (req, res) => {
    try {
        const keyword = req.query.keyword?.toLowerCase() || "";

        const sessionUser = req.session?.user;

        if (!sessionUser) {
            return res.status(401).json({ error: "Unauthorized"})
        }

        const user = await userModel.findById(sessionUser._id);

        const userRestrictions = user.restrictions || [];
        const userPreferences = user.preferences || [];
        const mealsPerDay = Math.min(Math.max(user.mealsPerDay || 3))
        const caloriePerMeal = Math.round((user.biometrics?.targetCalories || 1800) / 3)

        let query = {
            restrictions : { $nin : userRestrictions },
            cuisine: { $in: userPreferences },
            caloriesPerServing: { $lte: caloriePerMeal}
        }

        if (mealsPerDay > 3) {
            query.type = { $in: ["main", "snack"] };
        }

        const recipes = await recipeModel.find(query);
    } catch (err) {
        console.error("Error fetching recipes: ", err);
        res.status(500).json({ error: "Internal Server Error"});
    }
}