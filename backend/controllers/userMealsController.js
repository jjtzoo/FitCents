const UserMeals = require("../models/userMeals");
const UserGoals = require("../models/userGoals");
const UserData = require("../models/userData");
const Recipes = require("../models/recipes")

exports.getUserMeals = async(req, res) => {
    try{
        const data = UserMeals.find();
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
        const data = UserMeals.findById(req.params.id);
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
        const userId = req.params.id;

        const user = await UserData.findById(userId);
        const goals = await UserGoals.findOne({ user: userId});

        if (!user || !goals) {
            return res.status(404).json({ error: "User or goals not found."})
        }

        const recipes = await Recipes.find({
            calories: {$lte : goals.kcalPerMeal},
            cost : {$lte : goals.costPerMeal},
            tags: {$in: user.preference}
        })

        if (recipes.length === 0) {
            return res.status(404).json({error: "No matching recipes found"});
        }

        const meals = [];
        for (let i = 0; i < goals.totalMeals; i++) {
            const recipe = recipes[Math.floor(Math.random() * recipes.length)];
            meals.push({
                user:userId,
                recipe: recipe._id,
                day: Math.floor(i / user.mealsPerDay),
                mealNumber : (i % user.mealsPerDay) + 1,
            })
        }

        const savedMeals = await UserMeals.insertMany(meals);

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
        const data = await meatParts.findByIdAndUpdate(req.params.id);
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