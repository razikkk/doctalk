// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDg7sfOTVc7luVIeXsHHnDWd0vd3j2xdWo",
  authDomain: "chat-8864c.firebaseapp.com",
  projectId: "chat-8864c",
  storageBucket: "chat-8864c.firebasestorage.app",
  messagingSenderId: "790339234508",
  appId: "1:790339234508:web:e6aaacbe5b76fb4de17069",
  measurementId: "G-BHF49EG8N5"
};
const app = initializeApp(firebaseConfig)

// Initialize Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);