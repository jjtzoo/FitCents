const Recipes = require("../models/recipes");

exports.getAllRecipe = async(req, res) => {
    try {
        const recipes = await Recipes.find().populate({
            path: "meatPartId",
            select: "name meatCategoryId"
        })
        if (recipes.length > 0) {
            return res.status(200).json({
                message: `All Recipes Retrieved (${recipes.length})
                Latest recipe: ${recipes[recipes.length -1].label}`,
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
        const recipe = await Recipes.findById(req.params.id)
            .populate({ path: "meatPartId", select: "name meatCategoryId"});

        if (!recipe) {
            return res.status(404).json({
                error: "Recipe not found."
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
    console.log("POST /recipes body:", req.body);

    try {
        const newRecipe = new Recipes(req.body);
        const savedRecipe = await newRecipe.save();
        console.log(savedRecipe);
        return res.status(201).json({
            message: "New recipe successfully created.",
            recipe: savedRecipe
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
        const updateRecipe = await Recipes.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators: true});
        
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
        const deleteRecipe = await Recipes.findByIdAndDelete(req.params.id);
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
        return res.status(500).json({
            error: "Internal Server Error."
        });
    }
}