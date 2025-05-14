const express = require("express");
const userGoals = require("../models/userGoals");

let router = express.Router();

// http://localhost:3001/userGoals
// #1 Retrieve All
router.get("/", async (req, res) => {
    try {
        const goals = await userGoals.find();
        if(goals.length > 0) {
            return res.status(200).json({
            message: "All user goals retrieved!",
            users: goals
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
        const goals = await userGoals.findById(req.params.id)

        if (!goals) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        res.status(200).json({
            message: "User retrieved successfully",
            goal: goals
        })
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: "Internal Server Error."
        })
    }
});

// #3 Create One
router.post("/", async(req, res) => {
    try {
        const newUser = new userGoals(req.body);
        const savedUser = await newUser.save();
        res.status(201).json({
            message: "New user successfully created.",
            newuser : savedUser
        });
    } catch (err) {
        console.log("Error: ", err);
        return response.status(500).json({
            error: "Internal Server Error."
        })
    }
});

// #4 Update One
router.put("/:d", async(req, res) => {
    try {
        const updateGoals = await userGoals.findByIdAndUpdate(req.params.id);
        if (!updateGoals) {
            return res.status(404).json({
                error: "User goals not found."
            })
        };
        return res.status(200).json({
            message: "User goals successfully updated.",
            updatedGoals: updateGoals
        })

    } catch{

    }
});

// #5 Delete One
router.delete('/:d', async(req, res) => {
    try {
        const deleteUser = await userGoals.deleteOne(req.params.id);

        if (!deleteUser) {
            return response.status(404).json({
                error: "User not found."
            })
        }

        return response.status(200).json({
            message: "User successfully deleted."
        })
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: "Internal Server Error."
        })
    }
})


module.exports = router;