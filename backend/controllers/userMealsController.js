const UserMeals = require("../models/userMeals");
const UserGoals = require("../models/userGoals");
const UserData = require("../models/userData");
const Recipes = require("../models/recipes")

exports.getUserMeals = async(req, res) => {
    try{
        const data = await UserMeals.find();
        if(data.length > 0) {
            return res.status(200).json({
                message: 'All recipes record retrieve!',
                data: data
            });
        } else {
            return res.status(404).json({
                error: "No records found."
            });
        }
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        })
    }
}

exports.getMeal = async(req, res) => {
    try{
        const data = await UserMeals.findById(req.params.id);
        if (!data) {
            return res.status(404).json({
                error: "No records found."
            });
        }
        return res.status(200).json({
            message: "Recipe retrieved successfully!",
            data : data
        })
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        })
    }
}

exports.generateUserMeals = async(req, res) => {
    try {
        console.log("Request body:", req.body);
        const userId = req.body.userId;

        const user = await UserData.findById(userId);
        console.log("User found: ", user)
        const goals = await UserGoals.findOne({ user: userId });
        console.log("Goals found: ", goals)
        if (!user || !goals) {
            return res.status(404).json({ error: "User or goals not found."})
        }

        const minCalories = goals.kcalPerMeal * .87;
        const maxCalories = goals.kcalPerMeal * 1.13;

        const minCost = goals.costPerMeal * .85;
        const maxCost = goals.costPerMeal * 1.15;

        console.log("Calories range:", minCalories, maxCalories);
        console.log("Cost range:", minCost, maxCost);

        const allRecipes = await Recipes.find();
        console.log("Total recipes in DB:", allRecipes.length);
        console.log("First recipe sample:", allRecipes[0]);

        const recipes = await Recipes.find({
            caloriesPerServing: { $gte : minCalories, $lte : maxCalories },
            totalMealCost : { $gte : minCost, $lte : maxCost }
        });

        console.log("Matching recipes count:", recipes.length);
        if (recipes.length === 0) {
            return res.status(404).json({error: "No matching recipes found"});
        }

        const meals = [];
        for (let i = 0; i < goals.totalMeals; i++) {
            const recipe = recipes[Math.floor(Math.random() * recipes.length)];
            meals.push({
                mealNumber : (i % user.mealsPerDay) + 1,
                recipe: recipe._id
            })
        }

        const userMealsDoc = new UserMeals({
            userId,
            goalId: goals._id.toString(),
            totalMeals : goals.totalMeals,
            meals: meals
        })

        const savedMeals = await userMealsDoc.save();

        res.status(201).json({
            message: "User meals generated successfully",
            meals: savedMeals,
        });

    } catch(err) {
        console.error("Meal Generation error:", err);
        res.status(500).json({error : "Internal Server Error"});
    }
}

exports.updateUserMeal = async(req, res) => {
    try{
        const data = await UserMeals.findByIdAndUpdate(req.params.id, req.body, {new : true} );
        if (!data) {
            return res.status(404).json({error: 'No Meat-part found.'});
        }
        return res.status(200).json({
            message: "User update successful",
            data: data
        });
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        })
    }
}

exports.deleteUserMeal = async(req, res) => {
    try{
        const data = await UserMeals.findByIdAndUpdate(req.params.id);
        if (!data) {
            return res.status(404).json({
                error: "Recipe not found."
            })
        }
        res.status(200).json({
            message: "Recipe successfully deleted.",
            data: data
        })
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        })
    }
}