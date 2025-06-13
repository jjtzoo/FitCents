import express from "express";
import { generateGroceryList, getGroceryList, regenerateGroceryList } from "../controllers/groceryListController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js"
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();
// READ GroceryList /api/grocerylist//:mealPlanId
router.get(
    "/:mealPlanId",
    isAuthenticated,
    isAuthorized,
    requireRole(["regular", "premium", "developer"]),
    getGroceryList
);

// CREATE GroceryList /api/grocerylist//:mealPlanId
router.post(
    "/:mealPlanId",
    isAuthenticated,
    isAuthorized,
    requireRole(["regular", "premium", "developer"]),
    generateGroceryList
);

// ARCHIVE current grocery list if mealplan is disposed by the user, whether naturally (completing the meal plan) or forcefully (change of mind) falls under UPDATE 
// /api/grocerylist//:mealPlanId/regenerate
router.put(
    "/:mealPlanId/regenerate",
    isAuthenticated,
    isAuthorized,
    requireRole(["regular", "premium", "developer"]),
    regenerateGroceryList
);

export default router;
