import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth'

//firebase 9.6.7

const firebaseConfig = {
  apiKey: "AIzaSyDhrEMiD6xJUj0o85hAtE4srtQcc0g-0pY",
  authDomain: "turismo2-a5a22.firebaseapp.com",
  projectId: "turismo2-a5a22",
  storageBucket: "turismo2-a5a22.appspot.com",
  messagingSenderId: "75409989498",
  appId: "1:75409989498:web:92da3ca80e3cb3d2ba40c3",
  measurementId: "G-WCC047TGKJ"
};



// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const app = firebase.initializeApp(firebaseConfig);

const db = firebase.firestore(app);

const auth = getAuth(app);

export default {
  firebase,
  db,
  app,
  auth,
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  collection,
  addDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
};

export const database = getFirestore();
