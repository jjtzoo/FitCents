const express = require("express");
const database = require("./connect");

let userMealsRoute = express.Router();

// #1 Retrieve All
// http://localhost:3001/userMeals
userMealsRoute.route("/userMeals").get( async(request, response) => {
    try {
        const db = database.getDb();
        const data = await db.collection("userMeals").find({}).toArray();

        if (data.length > 0) {
            return response.status(200).json({
            message: "User Meals Retrieve",
            details: data
            })
        } else {
            return response.status(404).json({
                error: "No Data Found"
            })
        }
    } catch (error) {
        console.log("Error: ", error);
        return response.status(500).json({
            error: "Server Error."
        })
    }
});

// #2 Get One
userMealsRoute.route("/userMeals/:id").get( async(request, response) => {
    try {
        const db = database.getDb();
        const data = await db.collection("userMeals").findOne({ _id: request.params.id})

        if (data) {
            return response.status(200).json({
                message: "Meal successfully retrieve!",
                detail: data
            })
        } else {
            return response.status(404).json({ error: "Can't find meal _id"});
        }
    } catch (error) {
        console.log("Error: ", error);
        return response.status(500).json({ error: "Internal Server Error."})
    }
});

// #3 CreateOne 
userMealsRoute.route("/userMeals").post( async(request, response) => {
    try {
        const db = database.getDb();

        const { _id, ...mealData} = request.body;
        if (!_id) {
            return response.status(400).json({
                error: "_id is required"
            })
        }

        const newMealPlan = {
            _id,
            ...mealData
        };

        const data = db.collection("userMeals").insertOne(newMealPlan);

        return response.status(200).json({
            message: "Successfully added new MealPlan",
            data: data
        })
    } catch (error) {
        if (error.code === 11000) {
            return response.status(409).json({ error: "User meal plan has already been generated."});
        }

        return response.status(500).json({
            error: "Server Error",
            details: error.message
        })
    }
});

// #4 Update One
userMealsRoute.route("/userMeals/:id").put(async (request, response) => {
    try {
        const db = database.getDb();

        const {
            mealsBody
        } = request.body

        const updatedMeal  = {
            $set : {
                mealsBody
            }
        }


        const data = db.collection("userMeals").updateOne({_id : request.params.id}, updatedMeal);

        if(data.matchCount === 0) {
            return response.status(404).json({ error: "No matches were found"});

        }

        return response.status(200).json({
            message: "Mealplan has successfully been updated",
            data: data
        })

    } catch (error) {
        console.log("Error: ", error)
        return response.status(500).json({ error: "Internal Server Error."});
    }
});


// #5 delete One
userMealsRoute.route("/userMeals/:id").delete( async(request, response) => {
    try{
        const db = database.getDb();
        const data = db.collection("userMeals").delete({_id : request.params.id});

        if (data.deletedCount === 0) {
            return response.status(404).json({ error: "Cannot find Mealplan with that _id."})
        }

        return response.status(200).json({
            message: "Mealplan has successfully been deleted.",
            data: data
        });
    } catch (error) {
        console.error("Error: ", error);
        return response.status(500).json({
            error: "Internal Server Error."
        })
    }
});

module.exports = userMealsRoute;