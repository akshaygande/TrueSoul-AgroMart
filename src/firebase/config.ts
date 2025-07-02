// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-RCsvd30f9PueZhFG6xmG-9O60lMC09s",
  authDomain: "gemini-ecommerce-5344d.firebaseapp.com",
  projectId: "gemini-ecommerce-5344d",
  storageBucket: "gemini-ecommerce-5344d.firebasestorage.app",
  messagingSenderId: "926018986371",
  appId: "1:926018986371:web:c028c06a49afc2163616b6",
  measurementId: "G-R63TVJM6DN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;