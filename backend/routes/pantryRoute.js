import express from "express";
import { deductFromPantryController, getPantry, resetPantryController } from "../controllers/pantryController";
import { isAuthenticated } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = express.Router();

// Read Current Pantry values /api/pantry
router.get(
    "/",
    isAuthenticated,
    requireRole("premium", "developer"),
    getPantry
);

// reset /api/pantry/reset
router.post(
    "/reset",
    isAuthenticated,
    requireRole("premium", "developer"),
    resetPantryController
)

router.post(
    "/deduct",
    isAuthenticated,
    requireRole("premium", "developer"),
    deductFromPantryController
)


export default router;