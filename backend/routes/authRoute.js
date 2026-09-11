import express from "express";
import { login, logout, guestLogin } from "../controllers/authController.js"

const router = express.Router();

router.post("/login", login);
router.post("/guest", guestLogin);
router.post("/logout", logout);

export default router;