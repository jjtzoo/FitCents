import express from "express";
import { createUser, deleteUser, list, patch, read, update } from "../controllers/userController.js";
import { login } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", createUser );
router.post("/login", login);
router.get("/", list);
router.get("/:username", read);
router.put("/:username", update);
router.patch("/:username", patch);
router.delete("/:username", deleteUser);

export default router;