import { db } from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';
import { authenticateUser } from '../index.js'; // ✅ Import authentication middleware

// 📌 Start a chat (Check if chat exists, otherwise create)
export const startChat = async (req, res) => {
    try {
        const { workerId } = req.body;
        const userId = req.user.id; // ✅ Get user ID from token

        // Check if a chat already exists
        const chatQuery = await db.collection('chats')
            .where('users', 'array-contains', userId)
            .get();

        let chatId = null;
        chatQuery.forEach(doc => {
            const data = doc.data();
            if (data.users.includes(workerId)) {
                chatId = doc.id;
            }
        });

        if (chatId) {
            return res.status(200).json({ chatId });
        }

        // Create new chat
        const newChat = {
            users: [userId, workerId],
            lastMessage: '',
            timestamp: new Date().toISOString()
        };

        const chatRef = await db.collection('chats').add(newChat);
        res.status(201).json({ chatId: chatRef.id });

    } catch (error) {
        res.status(500).json({ error: 'Error starting chat: ' + error.message });
    }
};

// 📌 Send a message
export const sendMessage = async (req, res) => {
    try {
        const { chatId, message } = req.body;
        const senderId = req.user.id; // ✅ Get sender ID from token

        if (!chatId || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const messageData = {
            senderId,
            message,
            timestamp: new Date().toISOString(),
            read: false
        };

        await db.collection('chats').doc(chatId).collection('messages').add(messageData);
        await db.collection('chats').doc(chatId).update({
            lastMessage: message,
            timestamp: new Date().toISOString()
        });

        res.status(201).json({ success: true, message: 'Message sent' });

    } catch (error) {
        res.status(500).json({ error: 'Error sending message: ' + error.message });
    }
};

// 📌 Get messages of a chat
export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({ error: 'Chat ID is required' });
        }

        const messagesSnapshot = await db.collection('chats')
            .doc(chatId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .get();

        const messages = messagesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages: ' + error.message });
    }
};
