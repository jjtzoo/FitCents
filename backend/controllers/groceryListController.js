import MealPlan from "../models/mealPlanModel.js";
import Recipe from "../models/recipeModel.js";
import GroceryList from "../models/groceryListModel.js";
import { buildGroceryList } from "../utils/groceryListBuilder.js";

export const generateGroceryList = async (req, res) => {
    const { mealPlanId } = req.params;

    try { 
        const mealPlan = await MealPlan.findById(mealPlanId);

        if (!mealPlan) {
            return res.status(404).json({ error: "Meal plan not found." });
        }

        const existingList = await GroceryList.findOne({ mealPlan: mealPlanId});
        if (existingList) {
            return res.status(400).json({ error: "Grocery list already generated for this meal plan."})
        }

        const recipeIds = mealPlan.meals.flatMap(day => 
            day.meal.map(entry => entry.recipe)
        );

        const recipes = await Recipe.find({ _id: {$in: recipeIds}});

        const ingredientMap = {};

        recipes.forEach(recipe => {
            recipe.ingredients.forEach(ing => {
                const key = ing.ingredient.toLowerCase() + "|" + ing.unit;

                if (!ingredientMap[key]) {
                    ingredientMap[key] = {
                        ingredient: ing.ingredient,
                        label: ing.label,
                        unit: ing.unit,
                        category: ing.category,
                        pricePerUnit: ing.pricePerUnit,
                        totalQuantity: 0,
                        totalCost: 0,
                        totalCalories: 0
                    };
                }

                ingredientMap[key].totalQuantity += ing.quantity;
                ingredientMap[key].totalCost += ing.cost || 0;
                ingredientMap[key].totalCalories += ing.calories || 0;
            });
        });

        const ingredientList = Object.values(ingredientMap);
        const totalItems = ingredientList.length;
        const totalEstimatedCost = ingredientList.reduce((sum, item) => sum + item.totalCost, 0);
        const totalEstimatedCalories = ingredientList.reduce((sum, item) => sum + item.totalCalories, 0);

        const groceryList = new GroceryList({
            user: mealPlan.user,
            mealPlan: mealPlan._id,
            ingredients: ingredientList,
            totalItems,
            totalEstimatedCost,
            totalEstimatedCalories,
            generatedAt: new Date()
        });

        await groceryList.save();

        res.status(201).json({
            message: "Grocery Shopping List generated successfully.",
            groceryList
        });
    } catch (err) {
        console.error("Error generating grocery list: ", err);
        res.status(500).json({ error: "Internal Server Error"});
    }
}


export const regenerateGroceryList = async (req, res) => {
    const { mealPlanId } = req.params;

    try {
        const mealPlan = await MealPlan.findById(mealPlanId);

        if (!mealPlan) return res.status(404).json({ error: "Meal plan not found."})
        
        await GroceryList.updateMany(
            { mealPlan: mealPlanId, archived: false }, 
            {$set: { archived: true, archivedAt: new Date() } }
        );

        const groceryList = await buildGroceryList(mealPlan);
        await groceryList.save();

        return res.status(201).json({
            message: "Grocery list regenerated and old lists archived.",
            groceryList
        });

    } catch (err) {
        console.error("Error regenerating grocery lsit: ", err);
        return res.status(500).json({ error: "Internal Server Error."});
    }
};

export const getGroceryList = async (req, res) => {
    const { mealPlanId } = req.params;

    try {
        const groceryList = await GroceryList.findOne({
            mealPlan: mealPlanId,
            archived: false
        }).populate("mealPlan").populate("user")

        if (!groceryList) {
            return res.status(404).json({ message: "No active grocery list found."})
        }

        return res.status(200).json({ groceryList });
    } catch (err) {
        console.error("Error Fetching grocery list: ", err);
        return res.status(500).json({ error: "Internal Server Error"});
    }
}