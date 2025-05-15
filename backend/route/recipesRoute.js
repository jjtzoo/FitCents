const express = require("express");
const recipes = require("../models/recipe");


let router = express.Router();

// #1 Retrieve All
// http://localhost:3001/recipes
router.get('/', async(req, res) => {
    try {
        const recipes = await recipes.find();
        if (recipes.length > 0) {
            return res.status(200).json({
                message: 'All recipes record retrieve!',
                recipes: recipes
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

// get one 
route.get('/:id', async (req, res) => {
    try {
        const recipe = await recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({
                error: "No records found."
            });
        }

        return res.status(200).json({
            message: "Recipe retrieved successfully!",
            recipes : recipe
        })
    } catch(err) {
        console.log("Error:", err);
        return res.status(500).json({
            error: "Internal Server Error."
        });
    }
});

// createone
router.post('/', async (req, res) => {
    try {
        const newRecipe = new recipes(req.body);
        const savedRecipe = await newRecipe.save();

        res.status(201).json({
            message: "New user successfully created.",
            newrecipe : savedRecipe
        });
    } catch(err) {
        console.log("Error:", err);
        return res.status(500).json({
            error: "Internal Server Error."
        });
    }
});

// updateone
router.put('/:id', async (req, res) => {
    try {
        const updateRecipe = await recipes.findByIdAndUpdate(req.params.id, req.body, {new : true});
        if (!updateRecipe) {
            return res.status(404).json({error: "No recipe found."})
        }
        return res.status(200).json({
            message: "User update successful",
            recipe : updateRecipe
        })
    } catch(err) {
        console.log("Error:", err);
        return res.status(500).json({
            error: "Internal Server Error."
        });
    }
});

// deleteOne
router.delete("/:d", async(req, res) => {
    try {
        const deleteRecipe = await recipes.findByIdAndDelete(req.params.id);
        if (!deleteRecipe) {
            return res.status(404).json({
                error: "Recipe not found."
            })
        }
        res.status(200).json({
            message: "Recipe successfully deleted."
        })
    } catch(err) {
        console.log("Error: ", err);
        return response.status(500).json({
            error: "Internal Server Error."
        })
    }
});

module.exports = router;