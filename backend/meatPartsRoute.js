const express = require("express")

const database = require("./connect")

meatPartsRoute = express.Router()

// #1 Retrieve All
meatPartRoute.route("/meatParts").get( async(request, response) => {
    try {
            const db = database.getDb();
            const data = db.collection("meatParts").find({}).toArray();

            if (data.length > 0) {
                return response.status(200).json({
                    message: "Meat-part collection has successfully been retrieve.",
                    data: data
                })
            } else {
                return response(400).json({
                    error: "No collection was found or is empty."
                })
            }
    } catch(err) {
        return response.status(500).json({ error: "Internal Server Error."})
    }
});


// #2 Retrieve One
meatPartRoute.route("/meatParts/:id").get( async(request, response) => {
    try {
        const db = database.getDb();
        const data = db.collection("meatParts").findOne({ _id : request.params.id})
        if (data) {
            return response.status(200).json({
                message: "Meat Parts data has been retrieve.",
                data: data
            });
        } else {
            return response.status(404).json({
                error: "No data was found."
            });
        }

    } catch(err) {
        return response.status(500).json({ error: "Internal Server Error."})
    }
});

// #3 Create One
meatPartRoute.route("/meatParts").post( async(request, response) => {
    try {
        const db = database.getDb();

        const {
            _id,
            ...meatPartData
        } = request.body

        if (!_id) {
            return response.status(400).json({
                error: "_id is required."
            })
        }

        const newMeatPart = {
            _id,
            ...meatPartData
        }

        const data = db.collection("meatParts").insertOne(newMeatPart);

        if (data) {
            return response.status(200).json({
                message: "Meat-parts data has successfully been created.",
                data: data
            });
        } 
    } catch(err) {
        if(err.code === 1100) {
            return response.status(409).json({
                error: "Meat-part already exist."
            });
        }
        return response.status(500).json({ error: "Internal Server Error."})
    }
});


// #4 Update One
meatPartRoute.route("/meatParts/:id").put( async(request, response) => {
    try {
        const db = database.getDb();

        const {
            ...meatPartData
        } = request.body

        const updatedMeatPart = {
            $set : {
                ...meatPartData
            }
        }

        const data = db.collection("meatParts").updateOne({ _id: request.params.id}, updatedMeatPart);

        if (data.matchCount === 0) {
            return response.status(404).json({ error: "No matches found."})
        }

        return response.status(200).json({
            message: "Meat-part data has successfully been updated",
            data: data
        })
    } catch(err) {
        console.error("Error: ", err);
        return response.status(500).json({ error: "Internal Server Error."});
    }
});

// #5 Delete One
meatPartRoute.route("/meatParts/:id").delete( async(request, response) => {
    try {
        const db = database.getDb();
        const data = db.collection("meatParts").delete( {_id : request.params.id});

        if (data.deletedCount === 0) {
            return response.status(404).json({error: "Meat-part _id is not found."})
        }

        return response.status(200).json({
            message: "Meat-part data has successfully been deleted.",
            data: data
        }) 
    } catch(err) {
        console.error("Error: ", err);
        return response.status(500).json({ error: "Internal Server Error."})
    }
});