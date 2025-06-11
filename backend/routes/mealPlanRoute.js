import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { requireRole, limitDaysByRole } from "../middleware/roleMiddleware.js";
import { generateWeeklyMealPlan } from "../controllers/mealPlanController.js";

const router = express.Router();

router.post(
    "/generate",
    isAuthenticated,
    requireRole("regular", "premium", "developer"),
    limitDaysByRole(),
    generateWeeklyMealPlan
);

export default router;