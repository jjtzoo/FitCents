const express = require('express')
const userData = require("../models/userData");
const userController = require("../controllers/userDataController")


let router = express.Router();
// #1 Retrieve All
router.get("/", userController.getAllUser);
// http://localhost:3001/userData
// #2 Retrieve One
router.get("/:id", userController.getOneUser);
// #3 Create One 
router.post("/", userController.createUser);
// #4 Update One
router.put('/:id', userController.updateUser);
// #5 Delete One
router.delete('/:id', userController.deleteUser);
module.exports = router;