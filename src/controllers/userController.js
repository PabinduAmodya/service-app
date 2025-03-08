import { db } from '../firebase.js';
import User from '../models/userModel.js';
import Worker from '../models/workerModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {

  const newUserData = req.body

  if(newUserData.role=="admin"){
    if(req.user==null){
      res.json({
        message : "Please login as admin to create admin accounts"
      })
      return
    }

  if(req.user.role!="admin"){
    res.json({
      message :"Please login as admin to create admin accounts"
    })
    return
  }

  }
  try {
    const { name, email, password, role, workType, location, yearsOfExperience } = req.body;
    
    // Check if required fields are provided for all users
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required!' });
    }

    // For workers, check additional fields
    if (role === 'worker' && (!workType || !location || !yearsOfExperience)) {
      return res.status(400).json({ error: 'Work type, location, and years of experience are required for workers!' });
    }

    // Check if user already exists
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (!userSnapshot.empty) {
      return res.status(400).json({ error: 'User already exists!' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user or worker depending on the role
    let newUser;
    if (role === 'worker') {
      // Create a worker if the role is worker
      newUser = new Worker(name, email, hashedPassword, workType, location, yearsOfExperience);
    } else {
      // Create a regular user if the role is not worker
      newUser = new User(name, email, hashedPassword);
    }

    // Convert class instance to plain object before saving to Firestore
    const userRef = await db.collection('users').add({ 
      name: newUser.name, 
      email: newUser.email, 
      password: newUser.password, 
      role: newUser.role, 
      createdAt: newUser.createdAt, 
      ...(newUser.workType && { workType: newUser.workType }), 
      ...(newUser.location && { location: newUser.location }), 
      ...(newUser.yearsOfExperience && { yearsOfExperience: newUser.yearsOfExperience })
    });

    res.status(201).json({ message: 'User registered successfully!', userId: userRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user: ' + error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required!' });
    }

    // Check if the user exists in Firestore
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'User not found!' });
    }

    const userDoc = userSnapshot.docs[0];  // Get first matching document
    const user = userDoc.data();  // Get user data
    const userId = userDoc.id;  // Get Firestore document ID

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Wrong Password!' });
    }

    // Respond with a token
    const token = jwt.sign({ id: userId, email: user.email, role: user.role }, "Secret_Key-7973");
    
    res.json({
      message : "Login successful!",
      token : token,
      user: {
          id: userId,  // <-- Include the correct user ID
          email: user.email,
          name: user.name,
          role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error logging in: ' + error.message });
  }
};


// Function to get all workers
export const getAllWorkers = async (req, res) => {
  try {
      const workersSnapshot = await db.collection('users').where('role', '==', 'worker').get();
      
      if (workersSnapshot.empty) {
          return res.status(404).json({ message: 'No workers found!' });
      }

      const workers = workersSnapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data()  // Spread operator to include all worker details
      }));

      res.status(200).json(workers);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching workers: ' + error.message });
  }
};














//admin=> "email": "navi@example.com",
//   "password": "123", 

// worker=> "email": "janesmith@example.com",
//   "password": "123",