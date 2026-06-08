import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  projectId: "safe-haven-dog-ranch",
  appId: "1:858211423692:web:d0bbbb9a169b0d289eb969",
  storageBucket: "safe-haven-dog-ranch.firebasestorage.app",
  apiKey: "AIzaSyBLG_uyh-7GNHy-ioEon6btv1b3xVTP3FI",
  authDomain: "safe-haven-dog-ranch.firebaseapp.com",
  messagingSenderId: "858211423692",
  measurementId: "G-7RDREQXH37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Exporting necessary functions for the HTML pages
export { collection, addDoc, getDocs, query, where, updateDoc, doc, setDoc, getDoc, ref, uploadBytes, getDownloadURL };

// To the Volunteer Web Developer: 
// Firebase is officially initialized and connected to the project!
// You can now import 'db' into any of the HTML files to start reading/writing to Firestore.
