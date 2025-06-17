// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_APIKEY,
//   authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
//   databaseURL: process.env.NEXT_PUBLIC_DATABASEURL,
//   projectId: process.env.NEXT_PUBLIC_PROJECTID,
//   storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
//   appId: process.env.NEXT_PUBLIC_APPID,
//   measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
  apiKey: "AIzaSyAuF6WtTM8bQw0coC6htQnQ3lGhMfjmkgU",
  authDomain: "walk-on-the-block.firebaseapp.com",
  projectId: "walk-on-the-block",
  storageBucket: "walk-on-the-block.firebasestorage.app",
  messagingSenderId: "656366015014",
  appId: "1:656366015014:web:19b1b64fdd9e3a95238ce7",
  measurementId: "G-H5NSBP9ZTE"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);

export const analytics = app.name && typeof window !== 'undefined' ? getAnalytics(app): console.log("no window");
// const analytics = getAnalytics(app);
export const firebaseAuth = getAuth(app);
// export const db = getFirestore(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();