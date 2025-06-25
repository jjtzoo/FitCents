export const round = (num) => Math.round(num);

export const buildRecipeQuery = ({ kcalMin, kcalMax, costMin, costMax, restrictions, preferences}) => {
    const query = {
        caloriesPerServing: {$gte : round(kcalMin), $lte : round(kcalMax)},
        totalMealCost : {$gte: round(costMin), $lte: round(costMax)}
    };

    if (restrictions?.length) query.restrictions = { $nin: restrictions};
    if (preferences?.length) query.cuisine = {$in: preferences};

    return query;
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