const express = require("express");
const meatPartsController = require("../controllers/meatPartsController");

router = express.Router()

// #1 Retrieve All
// http://localhost:3001/meatParts
router.get("/", meatPartsController.getAllMeatPart);

// Retrieve One
router.get("/:id", meatPartsController.getMeatPart);

// Create One
router.post("/", meatPartsController.createMeatPart);

// Update One
router.put("/:id", meatPartsController.updateMeatParts);

// Delete One
router.delete("/:id", meatPartsController.deleteMeatPart);

module.exports = router;