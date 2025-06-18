// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCOpCIA2QcGAAfdWxv87PIokSql0hX5eA",
  authDomain: "boxoffice-bd269.firebaseapp.com",
  projectId: "boxoffice-bd269",
  storageBucket: "boxoffice-bd269.firebasestorage.app",
  messagingSenderId: "785641975856",
  appId: "1:785641975856:web:9fbc949d8df778556abdf5"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
