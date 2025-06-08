import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import { requireRole, limitDaysByRole } from "../middleware/roleMiddleware";

const generateMeals = (req, res) => res.status(501).json({ error: "Not implemented yet"});

const router = express.Router();

router.post(
    "/generate",
    isAuthenticated,
    requireRole("regular", "premium", "developer"),
    limitDaysByRole(),
    generateMeals
);

export default router;