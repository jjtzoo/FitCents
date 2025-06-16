import express from "express";
import { createUser, deleteUser, list, patch, read, update, updateMealsPerDay } from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", createUser );
router.get("/", isAuthenticated, isAuthorized, list);
router.get("/profile", isAuthenticated, read);
router.put("/:username", isAuthenticated, isAuthorized, update);
router.patch("/:username", isAuthenticated, isAuthorized, patch);
router.delete("/:username", isAuthenticated, isAuthorized, deleteUser);
router.put("/user/settings/meals", isAuthenticated, updateMealsPerDay);


export default router;