import express from 'express';
import { getAllWorkers } from '../controllers/userController.js';

const router = express.Router();

// Adjust the path to match '/api/workers'
router.get('/', getAllWorkers);

export default router;
