import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { createRecipes, getRecipes } from "../controllers/recipeController.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/create", isAuthenticated, requireRole("developer"), createRecipes);

router.get("/", isAuthenticated, requireRole("premium", "developer"), getRecipes);

export default router;