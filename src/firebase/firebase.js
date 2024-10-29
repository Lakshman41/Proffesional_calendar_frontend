// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB83a_2RqVe2fx-8QJR-aVVUOc1AF1dmwA",
  authDomain: "proffesional-calendar.firebaseapp.com",
  projectId: "proffesional-calendar",
  storageBucket: "proffesional-calendar.appspot.com",
  messagingSenderId: "703724859017",
  appId: "1:703724859017:web:ab42c566c044183286a058",
  measurementId: "G-WPH97GVS2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {app, auth};