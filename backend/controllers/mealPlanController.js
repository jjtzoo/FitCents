import MealPlan from "../models/mealPlanModel.js";
import Recipe from "../models/recipeModel.js";
import User from "../models/userModel.js"

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export const generateWeeklyMealPlan = async (req, res) => {
    try {
        
        const sessionUser = req.session.user;
        const userId =  sessionUser?._id;

        const user = await User.findById(userId);
        console.log("Fetched user:", user);

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
            !restrictions || !preferences || !budget_php ||
            !biometrics || !dietDuration_days || !mealsPerDay
        ) {
            return res.status(400).json({ error: "Missing user data for meal plan generation." });
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
        console.log("Recipe Query:", recipeQuery);
        console.log("Target meals needed:", dietDuration_days * mealsPerDay);
        
        if (!matchingRecipes.length) {
            return res.status(400).json({ error: "No matching recipes found."});
        }

        const repeatsNeeded = Math.ceil(totalMealsNeeded / matchingRecipes.length);
        const pool = Array.from({ length: repeatsNeeded }, () => shuffle(matchingRecipes)).flat();
        const selectedRecipes = pool.slice(0, totalMealsNeeded);

        const mealPlan = [];
        let recipeIndex = 0;

        for (let day = 0; day < dietDuration_days; day++) {
            const mealsForDay = [];
            for (let meal = 0; meal < mealsPerDay; meal++) {
                mealsForDay.push(selectedRecipes[recipeIndex++]); 
            }
            mealPlan.push({ day: day + 1, meals: mealsForDay });
        }

        const allRecipes = mealPlan.flatMap(e => e.meals);
        const totalCalories = allRecipes.reduce((sum, r) => sum + r.caloriesPerServing, 0)
        const totalCost = allRecipes.reduce((sum, r) => sum + r.totalMealCost, 0);

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
                meal: day.meals.map(m => ({
                    recipe: m._id,
                    name: m.recipeName,
                    caloriesPerServing: m.caloriesPerServing,
                    totalMealCost: m.totalMealCost,
                    label: m.label,
                    completed: false
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
    const { day, recipeId } = req.body;

    try {
        const mealPlan = await MealPlan.findById(planId)
        if (!mealPlan) {
            return res.status(404).json({ error: "Meal plan not found."});
        }

        let targetEntry = null;

        for (const dayEntry of mealPlan.meals) {
            if (dayEntry.day === day) {
                targetEntry = dayEntry.meal.find(recipes => recipes.recipe.toString() === recipeId);
                break;
            }
        }

        if (!targetEntry) {
            return res.status(404).json({ error: "Recipe not found in specified day."})
        }

        targetEntry.completed = !targetEntry.completed;

        await mealPlan.save();

        const allCompleted = mealPlan.meals.every(day =>
            day.meal.every(m => m.completed === true)
        )

        if (allCompleted && mealPlan.active) {
            mealPlan.active = false;
            mealPlan.archivedAt = new Date();
            await mealPlan.save();

            return res.status(200).json({
                message: "Meal marked completed. All meals are now completed. Plan archived.",
                planArchived: true,
                updatedMealPlan: mealPlan
            });
        }

        return res.status(200).json({
            message: "Meal completion toggled.",
            planArchived: false,
            updatedMealPlan: mealPlan
        });
        
    } catch (err) {
        console.error("Error toggling meal completion: ", err);
        res.status(500).json({ error: "Server error while updating meal completion"})
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

