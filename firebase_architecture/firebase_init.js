// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// TODO: Replace with the actual configuration object from Firebase Console
// Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForSafeHavenDogRanch123",
  authDomain: "safe-haven-dog-ranch.firebaseapp.com",
  projectId: "safe-haven-dog-ranch",
  storageBucket: "safe-haven-dog-ranch.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789",
  measurementId: "G-DUMMY12345"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize core Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// const analytics = getAnalytics(app);

export { app, auth, db, storage };
