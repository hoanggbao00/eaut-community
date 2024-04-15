// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1heurEjqo57J1-nWzv1bwB4xcTd3hOrM",
  authDomain: "doantotnghiep-eaut.firebaseapp.com",
  projectId: "doantotnghiep-eaut",
  storageBucket: "doantotnghiep-eaut.appspot.com",
  messagingSenderId: "102828523183",
  appId: "1:102828523183:web:aa225e61bbf026d6799e5a",
  measurementId: "G-7RK64C07W8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)