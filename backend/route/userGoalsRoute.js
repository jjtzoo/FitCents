const express = require("express");
const UserGoals = require("../models/userGoals");

let router = express.Router();

// http://localhost:3001/UserGoals
// #1 Retrieve All
router.get("/", async (req, res) => {
    try {
        const goals = await UserGoals.find();
        if(goals.length > 0) {
            return res.status(200).json({
            message: "All users' goals retrieved!",
            goals
            }); 
        } else {
            return res.status(404).json({
                error: "No goals records found."
            });
        }
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

// #2 Retrieve One
router.get("/:id", async(req, res) => {
    try {
        const goal = await UserGoals.findById(req.params.id)

        if (!goal) {
            return res.status(404).json({
                error: "User's goals not found"
            })
        }

        res.status(200).json({
            message: "User's goals retrieved successfully",
            goal
        })
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: "Internal Server Error."
        });
    }
});

// #3 Create One
router.post("/", async(req, res) => {
    try {
        const newGoals = new UserGoals(req.body);
        const savedGoals = await newGoals.save();
        res.status(201).json({
            message: "New user successfully created.",
            savedGoals
        });
    } catch (err) {
        if(err.name === "ValidationError" || err.code === 11000) {
            return res.status(400).json({error: err.message})
        }
        console.log("Error: ", err);
        return response.status(500).json({
            error: "Internal Server Error."
        })
    }
});

// #4 Update One
router.put("/:d", async(req, res) => {
    try {
        const updateGoals = await UserGoals.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if (!updateGoals) {
            return res.status(404).json({
                error: "User's goals not found."
            })
        };
        return res.status(200).json({
            message: "User's goals successfully updated.",
            updatedGoals: updateGoals
        })

    } catch (err) {
        console.error("Error updating goal: ", err);
        if (err.name === "CastError" || err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({error: "Internal Server Error."})
    }
});

// #5 Delete One
router.delete('/:d', async(req, res) => {
    try {
        const deleteUser = await UserGoals.findByIdAndDelete(req.params.id);

        if (!deleteUser) {
            return response.status(404).json({
                error: "User's goals not found."
            })
        }

        return response.status(200).json({
            message: "User's goals successfully deleted."
        })
    } catch (err) {
        console.log("Error: ", err);
        if (err.name === "CastError") {
            return res.status(400).json({ error: "Invalid goal ID format" });
        }
        return res.status(500).json({
            error: "Internal Server Error."
        })
    }
})


module.exports = router;