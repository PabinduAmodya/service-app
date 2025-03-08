import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './firebase.js';
import userRoutes from './routes/userRoutes.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON data

app.use('/api/users', userRoutes);

// Test Firebase connection
app.get('/test', async (req, res) => {
  try {
    await db.collection('test').add({ message: 'Firebase connected!' });
    res.send('🔥 Firestore is working!');
  } catch (error) {
    res.status(500).send('Firebase error: ' + error.message);
  }
});

// Example API route to get all users (You will add more routes for the services)
app.get('/users', async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const usersList = usersSnapshot.docs.map(doc => doc.data());
    res.json(usersList);
  } catch (error) {
    res.status(500).send('Error fetching users: ' + error.message);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
