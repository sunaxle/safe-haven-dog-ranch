import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  projectId: "safe-haven-dog-ranch",
  appId: "1:858211423692:web:d0bbbb9a169b0d289eb969",
  storageBucket: "safe-haven-dog-ranch.firebasestorage.app",
  apiKey: "AIzaSyBLG_uyh-7GNHy-ioEon6btv1b3xVTP3FI",
  authDomain: "safe-haven-dog-ranch.firebaseapp.com",
  messagingSenderId: "858211423692",
  measurementId: "G-7RDREQXH37"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const snap = await getDocs(collection(db, "dogs"));
    console.log("Dogs found:", snap.size);
  } catch (e) {
    console.error("Firestore error:", e.message);
  }
}
test();
