// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSzvEOEiuAjnplZjGmX0io5-Ngimu9NuU",
  authDomain: "jobtracker-1eeec.firebaseapp.com",
  projectId: "jobtracker-1eeec",
  storageBucket: "jobtracker-1eeec.firebasestorage.app",
  messagingSenderId: "910489952545",
  appId: "1:910489952545:web:8ab130c971b2f366b95e60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const storage = getStorage(app);