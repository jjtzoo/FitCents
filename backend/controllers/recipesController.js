const Recipes = require("../models/recipes");

exports.getAllRecipe = async(req, res) => {
    try {
        const recipes = await Recipes.find();
        if (recipes.length > 0) {
            return res.status(200).json({
                message: 'All Recipes record retrieve!',
                recipes
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
        });
    }
};


exports.getOneRecipe = async(req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({
                error: "No records found."
            });
        }

        return res.status(200).json({
            message: "Recipe retrieved successfully!",
            recipe
        });
    } catch(err) {
        console.log("Error:", err);
        return res.status(500).json({
            error: "Internal Server Error."
        });
    }
}

exports.createRecipe = async(req, res) => {
    try {
        const newRecipe = new Recipes(req.body);
        const savedRecipe = await newRecipe.save();

        res.status(201).json({
            message: "New recipe successfully created.",
            savedRecipe
        });
    } catch(err) {
        console.log("Error:", err);
        return res.status(500).json({
            error: "Internal Server Error."
        });
    }
}

exports.updateRecipe = async(req, res) => {
    try {
        const updateRecipe = await Recipes.findByIdAndUpdate(req.params.id, req.body, {new : true});
        if (!updateRecipe) {
            return res.status(404).json({error: "No recipe found."});
        }
        return res.status(200).json({
            message: "Recipe updated successfully.",
            updateRecipe
        });
    } catch(err) {
        console.log("Error:", err);
        return res.status(500).json({
            error: "Internal Server Error."
        });
    }
}

exports.deleteRecipe = async(req, res) => {
    try {
        const deleteRecipe = await recipes.findByIdAndDelete(req.params.id);
        if (!deleteRecipe) {
            return res.status(404).json({
                error: "Recipe not found."
            });
        }
        res.status(200).json({
            message: "Recipe successfully deleted."
        });
    } catch(err) {
        console.log("Error: ", err);
        return response.status(500).json({
            error: "Internal Server Error."
        });
    }
}