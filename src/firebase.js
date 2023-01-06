// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAa-jAJnuCtS0CaLWZPIgytv_H47zoa7CU",
  authDomain: "bowker-ideas.firebaseapp.com",
  projectId: "bowker-ideas",
  storageBucket: "bowker-ideas.appspot.com",
  messagingSenderId: "439856738815",
  appId: "1:439856738815:web:656430b02a06058604f7ca",
  measurementId: "G-F1EEDRNE0B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;
