//import { initializeApp } from "firebase/app";
import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZGQ8PtZr5JpLk4oBNVryB90xdmOQVAWc",
  authDomain: "sport-app-55e6a.firebaseapp.com",
  projectId: "sport-app-55e6a",
  storageBucket: "sport-app-55e6a.appspot.com",
  messagingSenderId: "206563673195",
  appId: "1:206563673195:web:5eb049b27fbefac2a41d2e"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}
firebase.firestore().settings({experimentalForceLongPolling: true})

const auth = firebase.auth()
const db = firebase.firestore(app);
const storage = firebase.storage(app)
export const fCategory = db.collection('cviky');

export { auth, storage, db };