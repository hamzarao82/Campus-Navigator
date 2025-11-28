// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDg9sCSahhWJFfXh02n5_Ky915lyMlO14A",
    authDomain: "campus-navigator-ebe14.firebaseapp.com",
    projectId: "campus-navigator-ebe14",
    storageBucket: "campus-navigator-ebe14.firebasestorage.app",
    messagingSenderId: "307524084543",
    appId: "1:307524084543:web:3461c06f5044472818298a",
    measurementId: "G-0Z1NX9YXCL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);