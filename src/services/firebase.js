// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdWkk7QRT3Z8kQDepzpJv9AeVbhNw6Bac",
  authDomain: "fitbyvg.firebaseapp.com",
  projectId: "fitbyvg",
  storageBucket: "fitbyvg.firebasestorage.app",
  messagingSenderId: "373757090524",
  appId: "1:373757090524:web:6bd45952dd717826013219",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth with persistence
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});

// Firestore & Storage
export const db = getFirestore(app);
export const storage = getStorage(app);
