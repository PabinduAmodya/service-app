import { db } from '../firebase.js'; 
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs

// 📌 Start a chat (Check if chat exists, otherwise create)
export const startChat = async (req, res) => {
    try {
        const { userId, workerId } = req.body;

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

        // If chat exists, return existing chat ID
        if (chatId) {
            return res.status(200).json({ chatId });
        }

        // If chat doesn't exist, create a new chat
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
        const { chatId, senderId, message } = req.body;

        if (!chatId || !senderId || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const messageData = {
            senderId,
            message,
            timestamp: new Date().toISOString(),
            read: false
        };

        // Add message to Firestore
        await db.collection('chats').doc(chatId).collection('messages').add(messageData);

        // Update last message in chat
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
