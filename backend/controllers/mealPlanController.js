import MealPlan from "../models/mealPlanModel.js";
import Recipe from "../models/recipeModel.js";
import User from "../models/userModel.js"

export const generateWeeklyMealPlan = async (req, res) => {
    try {
        const sessionUser = req.session.user;
        const username = sessionUser?.auth?.username;

        if (!username) {
            return res.status(400).json({ error: "Username not found."})
        }

        const user = await User.findOne({ "auth.username" : username});

        if (!user) {
            return res.status(404).json({ error: "User not found."});
        }

        const { restrictions, preferences, budget_php, biometrics, dietDuration_days, mealsPerDay } = user;
        const targetCalories = biometrics?.targetCalories || 2000;

        const kcalPerMeal = targetCalories / mealsPerDay;
        const kcalMin = .90 * kcalPerMeal;
        const kcalMax = 1.10 * kcalPerMeal;

        const costPerMeal = budget_php / (dietDuration_days * mealsPerDay);
        const costMin = .85 * costPerMeal;
        const costMax = 1.05 * costPerMeal;

        const recipeQuery = {
            caloriesPerServing : {$lte: kcalMax, $gte: kcalMin},
            totalMealCost: { $lte: costMax, $gte: costMin}
        };

        if (restrictions.length > 0) {
            recipeQuery.restrictions = { $nin: restrictions }
        }

        if (preferences.length > 0) {
            recipeQuery.cuisine = { $in: preferences };
        }

        const matchingRecipes = await Recipe.find(recipeQuery);
        if (matchingRecipes.length < dietDuration_days * mealsPerDay) {
            return res.status(400).json({ error: "Not enough matching recipes to generate meal plan"})
        }

        const mealPlan = [];
        let recipeIndex = 0;

        for (let  day = 0; day < dietDuration_days; day++) {
            const mealsForDay = [];
            for (let meal = 0; meal < mealsPerDay; meal++) {
                mealsForDay.push(matchingRecipes[recipeIndex]);
                recipeIndex++;
            }
            mealPlan.push({ day: day + 1, meals: mealsForDay})
        }

        const allRecipes = mealPlan.flatMap(e => e.meals);
        const totalCalories = allRecipes.reduce((sum, r) => sum + r.caloriesPerServing, 0)
        const totalCost = allRecipes.reduce((sum, r) => sum + r.totalMealCost, 0);
        const avgCalories = totalCalories / allRecipes.length;
        const avgCost = totalCost / allRecipes.length;

        const savedMealPlan = new MealPlan({
            user: user._id,
            meals : mealPlan.map(day => ({
                day: day.day,
                meals: day.meals.map(m => m.id)
            })),
            averageCaloriesPerServing: avgCalories,
            averageTotalMealCost: avgCost,
            totalCalories,
            totalCost
        });

        await savedMealPlan.save();

        res.status(201).json({
            message: "Meal plan generated successfully.",
            mealPlan: savedMealPlan
        });

    } catch(err) {
        console.error("Error generating meal plan: ", err);
        res.status(500).json({ error: "Internal server error."});     
    }
}