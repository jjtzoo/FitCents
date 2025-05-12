const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb")

let recipesRoute = express.Router();

// #1 Retrieve All
// http://localhost:3001/recipes
recipesRoute.route("/recipes").get(async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("recipes").find({}).toArray();
    console.log("Retrieve data", data);
    if (data.length > 0) {
        return response.json(data);
    } else {
        throw new Error("Data was not found.");
    }
});


// #2 Retrieve One 
recipesRoute.route("/recipes/:id").get(async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("recipes").findOne({_id: request.params.id});
    if (data) {
        return response.json(data);
    } else {
        throw new Error("Data was not found.");
    }
});


// #3 Create One
recipesRoute.route("/recipes").post(async (request, response) => {
    try {
        const db = database.getDb();

        const {
            _id,
            meatPartId,
            label,
            totalMealCost,
            caloriesPerServing,
            ingredients
        } = request.body;

        if (!_id) {
            return response.status(400).json({ error: "_id is required"});
        }

        const mongoObject = {
            _id,
            meatPartId,
            label,
            totalMealCost,
            caloriesPerServing,
            ingredients: ingredients.map(item => ({
                ingredient : item.ingredient,
                quantity: item.quantity,
                unit: item.unit,
                pricePerUnit: item.pricePerUnit,
                calories: item.calories,
                cost: item.cost
            }))

        }
    
        const data = await db.collection("recipes").updateOne(mongoObject);
        response.status(201).json({
            message: "New Recipe added successfully",
            data: data
        })
    } catch(error) {
        if (error.code === 11000) {
            return response.status(409).json({ error: "A recipe with that _id already exists"});
        }
        
        response.status(500).json({
            error: "Something went wrong",
            details: error.message
        });
    }

});

// #4 Update One

recipesRoute.route("/recipes/:id").put(async (request, response) => {
    try {
        const db = database.getDb();
        const {
            meatPartId,
            label,
            totalMealCost,
            caloriesPerServing,
            ingredients
        } = request.body;

        const mongoObject = {
            $set : {
                meatPartId,
                label,
                totalMealCost,
                caloriesPerServing,
                ingredients: ingredients.map(item => ({
                    ingredient : item.ingredient,
                    quantity: item.quantity,
                    unit: item.unit,
                    pricePerUnit: item.pricePerUnit,
                    calories: item.calories,
                    cost: item.cost
                }))
            }
        }
    
        const data = await db.collection("recipes").updateOne({_id: new ObjectId(request.params.id)}, mongoObject);
        response.json(data)
    } catch(error) {
        console.error("An expected error occurred", error);
        return response.status(500).json({ error: "Something went wrong on the server"});
    }

});

// #5 Delete One

recipesRoute.route("/recipes/:id").delete(async (request, response) => {
    try {
        const db = database.getDb();
        const data = await db.collection("recipes").deleteOne({_id: new ObjectId(request.params.id)});
        response.json(data)
    } catch(error) {
        console.error("An expected error occurred", error);
        return response.status(500).json({ error: "Something went wrong on the server"});
    }

});

module.exports = recipesRoute;