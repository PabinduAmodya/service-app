import express from 'express';
import { 
  createWorkRequest, 
  getUserWorkRequests, 
  getWorkerWorkRequests, 
  getWorkRequestById, 
  updateWorkRequestStatus, 
  addWorkRequestMessage 
} from '../controllers/workRequestController.js';

const router = express.Router();

// Create a new work request
router.post('/', createWorkRequest);

// Get all work requests for the logged-in user
router.get('/user', getUserWorkRequests);

// Get all work requests for a specific worker (worker ID in params)
router.get('/worker/:workerId?', getWorkerWorkRequests);

// Get a specific work request by ID
router.get('/:requestId', getWorkRequestById);

// Update the status of a work request
router.patch('/:requestId/status', updateWorkRequestStatus);

// Add a message to a work request
router.post('/:requestId/messages', addWorkRequestMessage);

export default router;


//workerid=1SSgOaGi4S5mT1SEahhl