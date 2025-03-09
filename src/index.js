import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { db } from './firebase.js';
import userRoutes from './routes/userRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import workRequestRoutes from './routes/workRequestRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import jwt from 'jsonwebtoken'

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON data
app.use(bodyParser.json()); // Parses JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses form data
//taken ekak awot token eka decode karala user information tika user reaquest ekat ekka yaweema
app.use(

  (req,res,next)=>{

    const token = req.header("Authorization")?.replace("Bearer ","")
    console.log(token)

    if(token != null){
      jwt.verify(token,"Secret_Key-7973" , (error,decoded)=>{

        if(!error){
          req.user = decoded        
        }

      })
    }

    next()

  }

)

// Routes
app.use('/api/users', userRoutes);
app.use('/api/workers', workerRoutes); // Fixed incorrect import
app.use('/api/requests', workRequestRoutes);
app.use('/api/chats', chatRoutes);


// Test Firebase connection
app.get('/test', async (req, res) => {
  try {
    await db.collection('test').add({ message: 'Firebase connected!' });
    res.send('🔥 Firestore is working!');
  } catch (error) {
    res.status(500).send('Firebase error: ' + error.message);
  }
});

// Fetch all users
app.get('/users', async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(usersList);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users: ' + error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
