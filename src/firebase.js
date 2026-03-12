import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtJTeXO2T3Lpx6Ic4GZRfI8xdQEYXdFPk",
  authDomain: "ai-saas-jatin.firebaseapp.com",
  projectId: "ai-saas-jatin",
  storageBucket: "ai-saas-jatin.firebasestorage.app",
  messagingSenderId: "306198381012",
  appId: "1:306198381012:web:59b78fa482650453da5641",
  measurementId: "G-7MYW661EVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
