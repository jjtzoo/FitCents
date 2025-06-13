export const buildGroceryList = async (mealPlan) => {
    const recipeIds = mealPlan.meals.flatMap(day =>
        day.meal.map(entry => entry.recipe)
    );

    const recipes = await Recipe.find({ _id: { $in: recipeIds } });

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

    return new GroceryList({
        user: mealPlan.user,
        mealPlan: mealPlan._id,
        ingredients: ingredientList,
        totalItems,
        totalEstimatedCost,
        totalEstimatedCalories,
        generatedAt: new Date(),
        archived: false
    });
};
