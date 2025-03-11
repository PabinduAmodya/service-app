import express from "express";
import { addReview, getWorkerReviews } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Protect routes

const router = express.Router();

router.post("/:workerId", authMiddleware, addReview); // Add a review (protected)
router.get("/:workerId", getWorkerReviews); // Get all reviews for a worker

export default router;
