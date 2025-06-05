import express from "express";
import { createUser, deleteUser, list, patch, read, update } from "../controllers/userController";
const router = express.Router();

router.post("/", createUser );
router.get("/", list);
router.get("/:username", read);
router.put("/:username", update);
router.patch("/:username", patch);
router.delete("/:username", deleteUser);

export default router;