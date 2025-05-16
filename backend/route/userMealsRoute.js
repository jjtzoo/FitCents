const express = require("express");
const UserMeals = require("../models/userMeals");
const UserMealsController = require("../controllers/userMealsController")

let router = express.Router();

// #1 Retrieve All
// http://localhost:3001/userMeals
router.get("/", async(req, res) => {
    try{
        const data = UserMeals.find();
        if(data.length > 0) {
            return res.status(200).json({
                message: 'All recipes record retrieve!',
                data: data
            });
        } else {
            return res.status(404).json({
                error: "No records found."
            });
        }
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        })
    }
});

// #2 Retrieve One
router.get("/:id", async(req, res) => {
    try{
        const data = UserMeals.findById(req.params.id);
        if (!data) {
            return res.status(404).json({
                error: "No records found."
            });
        }
        return res.status(200).json({
            message: "Recipe retrieved successfully!",
            data : data
        })
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        })
    }
});

// #3 CreateOne
router.post("/", UserMealsController.generateUserMeals);


// #4 Update One
router.put("/:id", async(req, res) => {
    try{
        const data = await UserMeals.findByIdAndUpdate(req.params.id, req.body, {new : true} );
        if (!data) {
            return res.status(404).json({error: 'No Meat-part found.'});
        }
        return res.status(200).json({
            message: "User update successful",
            data: data
        });
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        })
    }
});

// #5 Delete One
router.delete("/:id", async(req, res) => {
    try{
        const data = await meatParts.findByIdAndUpdate(req.params.id);
        if (!data) {
            return res.status(404).json({
                error: "Recipe not found."
            })
        }
        res.status(200).json({
            message: "Recipe successfully deleted.",
            data: data
        })
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        })
    }
});

module.exports = router;