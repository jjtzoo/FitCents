import MealPlan from "../models/mealPlanModel.js";
import Recipe from "../models/recipeModel.js";
import User from "../models/userModel.js"
import { buildRecipeQuery, buildMealPlan, shuffle, round } from "../utils/mealPlanner.util.js";


export const generateWeeklyMealPlan = async (req, res) => {
    try {
        
        const sessionUser = req.session.user;
        const userId =  sessionUser?._id;

        const user = await User.findById(userId);
        console.log("Fetched user:", user.auth?.username);

        if (!user) {
            return res.status(404).json({ error: "User not found."});
        }

        const { restrictions = [], preferences = [], budget_php, biometrics, dietDuration_days, mealsPerDay } = user;

        console.log("User data:", {
            restrictions,
            preferences,
            budget_php,
            biometrics,
            dietDuration_days,
            mealsPerDay
        });

        if (
            !dietDuration_days || !budget_php ||!biometrics || !mealsPerDay
        ) {
            return res.status(400).json({ error: "Missing user data for meal plan generation." });
        }

        if (dietDuration_days <= 0 || mealsPerDay <= 0) {
            return res.status(400).json({ error: "Invalid diet duration or meal frequency"});
        }

        const totalMealsNeeded = dietDuration_days * mealsPerDay;
        const targetCalories = biometrics?.targetCalories || 2000;

        const existingActivePlan = await MealPlan.findOne({ user: user._id, active: true});
        if (existingActivePlan) {
            existingActivePlan.active = false;
            existingActivePlan.archivedAt = new Date();
            await existingActivePlan.save();
        }
        
        const kcalPerMeal = targetCalories / mealsPerDay;
        const kcalMin = 0.85 * kcalPerMeal;
        const kcalMax = 1.15 * kcalPerMeal;

        const costPerMeal = budget_php / totalMealsNeeded;
        const costMin = 0.85 * costPerMeal;
        const costMax = 1.15 * costPerMeal;

        // MAIN QUERY

        const recipeQuery = buildRecipeQuery({ kcalMin, kcalMax, costMin, costMax, restrictions, preferences});
        console.log("Recipe queries: ", recipeQuery)
        let matchingRecipes = await Recipe.find(recipeQuery);

        console.log("Matched Recipes:", matchingRecipes.length, matchingRecipes.map(recipe => recipe.label));

        if (!matchingRecipes.length) {
           console.warn("No matches. Trying relaxed query");
           const fallbackQuery = buildRecipeQuery({
            kcalMin: kcalMin * 0.9,
            kcalMax: kcalMax * 1.1,
            costMin: costMin * 0.8,
            costMax: costMax * 1.2,
            restrictions,
            preferences
           });

           matchingRecipes = await Recipe.find(fallbackQuery)
           console.log("Fallback Query: ", fallbackQuery);
           if (!matchingRecipes.length) {
                return res.status(400).json({ error: "No matching recipes found, even with fallback"});
           }
        }

        const shuffledRecipes = shuffle(matchingRecipes);
        const selectedRecipes = Array.from({ length: totalMealsNeeded }, (_, index) => {
            return shuffledRecipes[index % shuffledRecipes.length]
        }) 

        const mealPlan = buildMealPlan(selectedRecipes, dietDuration_days, mealsPerDay)

        const allRecipes = mealPlan.flatMap(day => day.meals);
        const totalCalories = allRecipes.reduce((sum, recipe) => sum + recipe.caloriesPerServing, 0)
        const totalCost = allRecipes.reduce((sum, recipe) => sum + recipe.totalMealCost, 0);

        const averageCaloriesPerServing = totalCalories / totalMealsNeeded;
        const averageTotalMealCost = totalCost / totalMealsNeeded;

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + dietDuration_days);

        const savedMealPlan = new MealPlan({
            user: user._id,
            mealsPerDay,
            dietDuration_days,
            meals: mealPlan.map(day => ({
                day: day.day,
                meal: day.meals.map(recipe => ({
                    recipe: recipe._id,
                    name: recipe.recipeName,
                    caloriesPerServing: recipe.caloriesPerServing,
                    totalMealCost: recipe.totalMealCost,
                    label: recipe.label,
                    mealType: recipe.mealType,
                    completed: false,
                    ingredients: recipe.ingredients
                }))
            })),
            averageCaloriesPerServing,
            averageTotalMealCost,
            totalCalories,
            totalCost,
            active: true,
            expiresAt
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
};

export const toggleMealCompletion = async (req, res) => {
    const { planId } = req.params;
    const { day, index } = req.body;

    try {
        const mealPlan = await MealPlan.findById(planId);
        if (!mealPlan) return res.status(404).json({ error: "Meal plan not found." });

        const dayEntry = mealPlan.meals.find(d => d.day === day);
        if (!dayEntry) return res.status(404).json({ error: "Day not found in meal plan." });

        if (index < 0 || index >= dayEntry.meal.length)
        return res.status(400).json({ error: "Invalid meal index." });

        dayEntry.meal[index].completed = !dayEntry.meal[index].completed;
        await mealPlan.save();

        const allCompleted = mealPlan.meals.every(day =>
        day.meal.every(m => m.completed === true)
        );

        if (allCompleted && mealPlan.active) {
        mealPlan.active = false;
        mealPlan.archivedAt = new Date();
        await mealPlan.save();
        return res.status(200).json({
            message: "All meals completed. Plan archived.",
            planArchived: true,
            updatedMealPlan: mealPlan,
        });
        }

        res.status(200).json({
        message: "Meal completion toggled.",
        planArchived: false,
        updatedMealPlan: mealPlan,
        });
    } catch (err) {
        console.error("Error toggling meal completion:", err);
        res.status(500).json({ error: "Server error while updating meal completion" });
    }
};

export const getActiveMealPlan = async (req, res) => {
    try {
        const userId = req.session.user?._id;

        const activePlan = await MealPlan.findOne({ user: userId, active: true });

        if (!activePlan) {
            return res.status(404).json({ message: "No active meal plan found." });
        }

        res.status(200).json(activePlan);
    } catch (err) {
        console.error("Error fetching active meal plan:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

