export const round = (num) => Math.round(num);

export const buildRecipeQuery = ({ kcalMin, kcalMax, costMin, costMax, restrictions, preferences}) => {
    const query = {};

    if (kcalMin != null && kcalMax != null) {
        query.caloriesPerServing = { $gte: round(kcalMin), $lte: round(kcalMax) };
    }
    if (costMin != null && costMax != null) {
        query.totalMealCost = { $gte: round(costMin), $lte: round(costMax) };
    }
    if (restrictions?.length) query.restrictions = { $nin: restrictions};
    if (preferences?.length) query.cuisine = {$in: preferences};

    return query;
};

// Sorts recipes by how close they are to the target calorie/cost per meal,
// so a relaxed/unbounded query still produces a sensible plan instead of a
// random one.
export const sortByClosestMatch = (recipes, kcalTarget, costTarget) => {
    return [...recipes].sort((a, b) => {
        const scoreA = Math.abs(a.caloriesPerServing - kcalTarget) / kcalTarget
            + Math.abs(a.totalMealCost - costTarget) / costTarget;
        const scoreB = Math.abs(b.caloriesPerServing - kcalTarget) / kcalTarget
            + Math.abs(b.totalMealCost - costTarget) / costTarget;
        return scoreA - scoreB;
    });
};


export const shuffle = (arr) => arr.sort(()=> 0.5 - Math.random());

export const buildMealPlan = (recipes, days, mealsPerDay) => {
    const mealPlan = [];
    let recipeIndex = 0;
    for (let day = 0; day < days; day++) {
        const mealsForDay = [];
        for (let meal = 0; meal < mealsPerDay; meal++) {
            mealsForDay.push(recipes[recipeIndex++]);
        }
        mealPlan.push({ day: day + 1, meals: mealsForDay});
    }
    return mealPlan
}