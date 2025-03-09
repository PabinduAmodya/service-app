import express from 'express';
import { startChat, sendMessage, getMessages } from '../controllers/chatController.js';

const router = express.Router();

// Start a new chat (or get existing chat)
router.post('/start', startChat);

// Send a message
router.post('/send', sendMessage);

// Get messages for a chat
router.get('/:chatId/messages', getMessages);

export default router;
