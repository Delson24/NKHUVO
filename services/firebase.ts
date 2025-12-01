// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// SUBSTITUA COM AS SUAS CHAVES DO FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSy...",
  authDomain: "nkhuvo-app.firebaseapp.com",
  projectId: "nkhuvo-app",
  storageBucket: "nkhuvo-app.appspot.com",
  messagingSenderId: "899...",
  appId: "1:899...",
  measurementId: "G-..."
};

// Initialize Firebase
// Note: We use a check to prevent re-initialization in some hot-reload environments
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;