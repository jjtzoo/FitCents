const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb")

let recipesRoute = express.Router();

// #1 Retrieve All
// http://localhost:3000/posts
recipesRoute.route("/recipes").get(async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("recipes").find({}).toArray();
    if (data.length > 0) {
        return response.json(data);
    } else {
        throw new Error("Data was not found.");
    }
});


// #2 Retrieve One 
recipesRoute.route("/recipes/:id").get(async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("recipes").findOne({_id: new ObjectId(request.params.id)});
    if (Object.keys(data).length > 0) {
        return response.json(data);
    } else {
        throw new Error("Data was not found.");
    }
});


// #3 Create One
recipesRoute.route("/recipe").post(async (request, response, next) => {
    try {
        const db = database.getDb

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
    
        const data = await db.collection("recipes").insertOne(mongoObject);
        response.json(data)
    } catch(error) {
        if (error.code === 11000) {
            return response.status(409).json({ error: "A recipe with that _id already exists"});
        }
        next(error);
    }

});

// #4 Update One

recipesRoute.route("/recipe").put(async (request, response, next) => {
    try {
        const db = database.getDb
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
    
        const data = await db.collection("recipes").insertOne(mongoObject);
        response.json(data)
    } catch(error) {
        if (error.code === 11000) {
            return response.status(409).json({ error: "A recipe with that _id already exists"});
        }
        next(error);
    }

});
// #5 Delete One