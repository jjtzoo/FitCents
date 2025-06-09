import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const getAllUsers = (req, res) => {
  res.status(501).json({ error: "getAllUsers not implemented yet." });
};

const updateUser = (req, res) => {
  res.status(501).json({ error: "updateUser not implemented yet." });
};

const deleteUser = (req, res) => {
  res.status(501).json({ error: "deleteUser not implemented yet." });
};

const dumpCollection = (req, res) => {
  res.status(501).json({ error: "dumpCollection not implemented yet." });
};

const router = express.Router();

router.use(isAuthenticated, requireRole("developer"));

router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/database/:collection", dumpCollection);

export default router;
