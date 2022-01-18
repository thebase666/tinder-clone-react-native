import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGtesovVZR6B7BO8rnTdZTrjcCgFWLTWo",
  authDomain: "rntinder-7d34d.firebaseapp.com",
  projectId: "rntinder-7d34d",
  storageBucket: "rntinder-7d34d.appspot.com",
  messagingSenderId: "218055958127",
  appId: "1:218055958127:web:5b4cd4b71c8be7a8a0379a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db }