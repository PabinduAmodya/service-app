// routes/reviewRoutes.js
import express from "express";
import { addReview, getWorkerReviews } from "../controllers/reviewController.js";
import { authenticateUser } from "../middlewear/authmiddlewear.js"; // Using your existing auth middleware

const router = express.Router();

// Add a review (protected)
router.post("/:workerId", authenticateUser, addReview);

// Get all reviews for a worker
router.get("/:workerId", getWorkerReviews);

export default router;