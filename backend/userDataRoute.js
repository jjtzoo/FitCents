const express = require("express");
const database = require("./connect")

const { ObjectId } = require("mongodb");

let userDataRoute = express.Router();

// #1 Retrieve All
// http://localhost:3001/userData
userDataRoute.route("/userData").get( async (request, response) => {
    try {
        const db = database.getDb();
        let data = await db.collection("userData").find({}).toArray();
        console.log("Retrieve Data", data);
        if (data.length > 0) {
            return response.json(data);
        } else {
            return response.status(404).json({
                error: "No data found",
                message: "No records found in the database."
            })
        }
    } catch (error) {
        console.log("Error: ", error)
        return response.status(500).json({ error: "Something went wrong on the server"});
    }
});

// #2 Get One
userDataRoute.route("/userData/:id").get ( async(request, response) => {
    try {
        let db = database.getDb();
        let data = await db.collection("userData").findOne({_id: request.params.id});
        if (data) {
            return response.json(data);
        } else {
            return response.status(404).json({
                error: "User not found",
                message: "The user with the given ID was not found in the database."
            })
        }
    } catch (error) {
        console.log("Error: ", error);
        return response.status(500).json({
            error: "Internal Server Error",
            message: "Something went wrong. Please try again later."
        })
    }

});

// #3 Create One
userDataRoute.route("/userData").post( async(request, response) => {
    try {
        const db = database.getDb();

        const {
            _id,
            name,
            email,
            pin,
            targetCaloriesPerDay,
            mealsPerDay,
            dietDuration,
            budget,
            role,
            preference
        } = request.body;

        if (!_id) {
            return response.status(400).json({ error: "_id required"});
        };

        const mongoObject = {
            _id,
            name,
            email,
            pin,
            targetCaloriesPerDay,
            mealsPerDay,
            dietDuration,
            budget,
            role,
            preference
        };

        const data = await db.collection("userData").insertOne(mongoObject);
        
        return response.status(201).json({
            message: "User data created successfully",
            data: data
        });

    } catch (error) {
        if (error.code === 11000) {
            return response.status(409).json({ error: "A recipe with that _id already exists"});
        }
        
        return response.status(500).json({
            error: "Something went wrong",
            details: error.message
        });
    }
});

// #4 Update One
userDataRoute.route("/userData/:id").put( async(request, response) => {
    try {
        const db = database.getDb();
        
        const {
            name,
            email,
            pin,
            targetCaloriesPerDay,
            mealsPerDay,
            dietDuration,
            budget,
            role,
            preference
        } = request.body;

        const mongoObject = {
            $set : {
                name,
                email,
                pin,
                targetCaloriesPerDay,
                mealsPerDay,
                dietDuration,
                budget,
                role,
                preference
            }
        };

        const data = await db.collection("userData").updateOne({_id: request.params.id}, mongoObject);
        
        if(data.matchCount === 0) {
            return response.status(404).json({
                error: "User not found"
            });
        }
        
        return response.status(201).json({
            message: "User Data has been successfully updated",
            data: data
        })
    } catch(error) {
        console.error("Error updating user data:", error);
        return response.status(500).json({
            error: "Something went wrong on the server."
        })
    }
});

// #5 Delete One
userDataRoute.route("/userData/:id").delete( async(request, response) => {
    try {
        const db = database.getDb();
        const data = await db.collection("userData").deleteOne({ _id: request.params.id });

        if (data.deletedCount === 0) {
            return response.status(404).json({ error : "User not found"});
        }

        return response.status(200).json({
            message: "User successfully deleted.",
            data: data
        });
    } catch (error) {
        console.error("An expected error occurred", error);
        return response.status(500).json({
            error: "Something went wrong"
        });
    }
});

module.exports = userDataRoute;