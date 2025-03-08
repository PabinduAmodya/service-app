import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Read service account key JSON file
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { admin, db };
