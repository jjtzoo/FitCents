const express = require("express");
const database = require("./connect");

const { ObjectId } = require("mongodb");

let userGoalsRoute = express.Router();

// #1 Retrieve All
// http://localhost:3001/userGoals
userGoalsRoute.route("/userGoals").get( async(request, response) => {
    try {
        const db = database.getDb();
        const data = await db.collection("userGoals").find({}).toArray();
        console.log("Retrieve Data", data);
        if (data.length > 0) {
            return response.json(data);
        } else {
            return response.status(404).json({
                error: "No data found",
                message: "collection is currently empty"
            })
        } 

    }catch (error) {
        console.log("Error: ", error);
        return response.status(500).json({
            error: "Something went wrong while fetching data from the server."
        })
    }
});

// #2 Get One
userGoalsRoute.route("/userGoals/:id").get(async ( request, response) => {
    try {
        let db = database.getDb();
        let data = await db.collection("userGoals").findOne({_id: request.params.id})
        if (data) {
            return response.json(data);
        } else {
            return response.status(404).json({
                error: "User not found",
                message: "The user with the given ID was not found in the userGoals collection."
            });
        }
    } catch (error) {
        console.log("Error: ", error);
        return response.status(500).json({
            error: "Internal Server Error",
            message: "Something went wrong while fetching data from the server."
        })
    }
});

// #3 Create One
userGoalsRoute.route("/userGoals").post( async(request, response) => {
    try {
        let db = database.getDb();
        const {
            _id,
            userDataId, 
            totalOverallKcal,
            totalMealsForPlan,
            costPerMeal,
            kcalPerMeal
        } = request.body;

        if (!_id) {
            return response.status(400).json({
                error: "_id is required"
            });
        }

        const newGoal = {
            _id,
            userDataId,
            totalOverallKcal,
            totalMealsForPlan,
            costPerMeal,
            kcalPerMeal
        }

        const data = await db.collection("userGoals").insertOne(newGoal);

        return response.status(200).json({
            message: "user Goals created successfully",
            data: data
        });
    } catch (error) {
        if(error.code === 11000) {
            return response.status(409).json({ error: "user goals has already been generated."});
        }

        return response.status(500).json({
            error: "Something went wrong",
            details: error.message
        });
    }
});

// #4 Update One
userGoalsRoute.route("/userGoals/:id").put( async(request, response) => {
    try {
        const db = database.getDb();

        const {
            userDataId,
            totalOverallKcal,
            totalMealsForPlan,
            costPerMeal,
            kcalPerMeal
        } = request.body;

        const updateGoals = {
            $set : {
                userDataId,
                totalOverallKcal,
                totalMealsForPlan,
                costPerMeal,
                kcalPerMeal
            }
        };

        const data = await db.collection("userGoals").updateOne({_id: request.params.id}, updateGoals);

        if(data.matchCount === 0 ) {
            return response.status(404).json({
                error: "No goals was found"
            });
        }

        return response.status(200).json({
            message: "Goals has been successfully updated",
            data: data
        })
    } catch(error) {
        console.error("Error updating user data: ", error);
        return response.status(500).json({
            error: "Something went wrong on the server"
        })
    }
});

// #5 delete one
userGoalsRoute.route("/userGoals/:id").delete( async(request, response) => {
    try {
        const db = database.getDb();
        const data = await db.collection("userGoals").deleteOne({_id : request.params.id});

        if (data.deletedCount === 0) {
            return response.status(404).json({error : "Goal not found"});
        };

        return response.status(200).json({
            message: "Goals successfully deleted.",
            data: data
        });
    } catch(error) {
        console.error("An expected error occured", error);
        return response.status(500). json({
            error: "Something went wrong."
        })
    }
});

module.exports = userGoalsRoute;