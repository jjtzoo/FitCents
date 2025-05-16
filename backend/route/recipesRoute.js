const express = require("express");
const recipesController = require("../controllers/recipesController");


let router = express.Router();

// #1 Retrieve All
// http://localhost:3001/recipes
router.get('/', recipesController.getAllRecipe);

// get one 
router.get('/:id', recipesController.getOneRecipe);

// createone
router.post('/', recipesController.createRecipe);

// updateone
router.put('/:id', recipesController.updateRecipe);

// deleteOne
router.delete("/:d", recipesController.deleteRecipe);

module.exports = router;