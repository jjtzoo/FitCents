import express from "express";
import { createUser, deleteUser, list, patch, read, update } from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", createUser );
router.get("/", isAuthenticated, isAuthorized, list);
router.get("/profile", isAuthenticated, isAuthorized, read);
router.get("/:username",isAuthenticated, isAuthorized, read);
router.put("/:username", isAuthenticated, isAuthorized, update);
router.patch("/:username", isAuthenticated, isAuthorized, patch);
router.delete("/:username", isAuthenticated, isAuthorized, deleteUser);

export default router;