import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const getPantry = (req, res) => {
    res.status(501).json({ error: "getPantry not implemented yet." });
};

const router = express.Router();

router.get(
    "/pantry",
    isAuthenticated,
    requireRole("premium", "developer"),
    getPantry
);


export default router;