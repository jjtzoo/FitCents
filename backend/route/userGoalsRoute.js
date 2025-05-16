const express = require("express");
const UserGoalsController = require("../controllers/userGoalsController")

let router = express.Router();

// http://localhost:3001/UserGoals
// #1 Retrieve All
router.get("/", UserGoalsController.getAllGoals);

// #2 Retrieve One
router.get("/:id", UserGoalsController.getGoal);

// #3 Create One
router.post("/", UserGoalsController.createGoals);

// #4 Update One
router.put("/:d", UserGoalsController.updateGoals);

// #5 Delete One
router.delete('/:d', UserGoalsController.deleteGoal);


module.exports = router;