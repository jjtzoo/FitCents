import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { requireRole, limitDaysByRole } from "../middleware/roleMiddleware.js";
import { generateWeeklyMealPlan, toggleMealCompletion } from "../controllers/mealPlanController.js";

const router = express.Router();

router.post(
    "/generate",
    isAuthenticated,
    requireRole("regular", "premium", "developer"),
    limitDaysByRole(),
    generateWeeklyMealPlan
);

router.patch("/meal-plans/:planId/toggle",
    isAuthenticated,
    toggleMealCompletion
)
export default router;