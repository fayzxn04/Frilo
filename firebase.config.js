import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqgdeaZfYKWC0-8idJmfekGHhiOAiAgt8",
  authDomain: "frilo-d5c0c.firebaseapp.com",
  projectId: "frilo-d5c0c",
  storageBucket: "frilo-d5c0c.firebasestorage.app",
  messagingSenderId: "915904207908",
  appId: "1:915904207908:web:3b82bc3c4ff03c22d8ccb1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
