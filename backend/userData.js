const express = require("express");
const database = require("./connect")

const { ObjectId } = require("mongodb");

let useDataRoute = express.Router();

// #1 Retrieve All
// http://localhost:3001/userData
useDataRoute.route("/userData").get( async (request, response) => {
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
useDataRoute.route("/userData/:id").get ( async(request, response) => {
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
useDataRoute.route("/userData").post( async(request, response) => {
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
        response.status(201).json({
            message: "User data created successfully",
            data: data
        });

    } catch (error) {
        if (error.code === 11000) {
            return response.status(409).json({ error: "A recipe with that _id already exists"});
        }
        
        response.status(500).json({
            error: "Something went wrong",
            details: error.message
        });
    }
});

useDataRoute.route("/userData/:id").put( async(request, response) => {
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
    } catch {
        
    }
});