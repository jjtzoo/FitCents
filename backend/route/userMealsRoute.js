const express = require("express");
const UserMeals = require("../models/userMeals");
const UserMealsController = require("../controllers/userMealsController")

let router = express.Router();

// #1 Retrieve All
// http://localhost:3001/userMeals
router.get("/", UserMealsController.getUserMeals);

// #2 Retrieve One
router.get("/:id", UserMealsController.getMeal);

// #3 CreateOne
router.post("/", UserMealsController.generateUserMeals);


// #4 Update One
router.put("/:id", UserMealsController.updateUserMeal);

// #5 Delete One
router.delete("/:id", UserMealsController.deleteUserMeal);

module.exports = router;