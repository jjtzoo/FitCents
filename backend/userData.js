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
            throw new Error("Data was not found");
        }
    } catch (error) {
        console.log("Error: ", error)
        return response.status(500).json({ error: "Something went wrong on the server"});
    }
});
