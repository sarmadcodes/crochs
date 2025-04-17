// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore} from "@firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDK4T_ATg53shwfoWbpZigwBlzLVL2TbYw",
  authDomain: "crochet-store-e7da1.firebaseapp.com",
  projectId: "crochet-store-e7da1",
  storageBucket: "crochet-store-e7da1.firebasestorage.app",
  messagingSenderId: "546950482110",
  appId: "1:546950482110:web:36a7fd95157350246e36ef",
  measurementId: "G-TYRDPXKXZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
