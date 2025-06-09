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