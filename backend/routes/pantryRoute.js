import express from "express";
import { buildPantryFromGroceryList, deductFromPantryController, getPantry, manuallyUpdatePantryItem, resetPantryController, updatePantryWithNewGroceryList } from "../controllers/pantryController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Read Current Pantry values /api/pantry
router.get(
    "/",
    isAuthenticated,
    requireRole("premium", "developer"),
    getPantry
);

// POST reset to 0 /api/pantry/reset
router.post(
    "/reset",
    isAuthenticated,
    requireRole("premium", "developer"),
    resetPantryController
);

// POST deduct upon clicking meal check in frontend 
router.post(
    "/deduct",
    isAuthenticated,
    requireRole("premium", "developer"),
    deductFromPantryController
);

// POST built pantry from current grocerylist(initial builder)
router.post(
    "/build",
    isAuthenticated,
    requireRole("premium", "developer"),
    buildPantryFromGroceryList
);

// PUT: Update pantry with new grocery list typical scenario would be 
router.put(
    "/update-from-grocerylist",
    isAuthenticated,
    requireRole("premium", "developer"),
    updatePantryWithNewGroceryList
);

// PUT: Manually update or add a pantry system (Optional for future faeture magic ingredient button)
router.put(
    "/manual-update",
    isAuthenticated,
    requireRole("premium", "developer"),
    manuallyUpdatePantryItem
);

export default router;