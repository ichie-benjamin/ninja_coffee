// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import {login} from "boot/general";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC4WggDtr4SnMVc5qPEH-cyvqcbN9iAxTM",
  authDomain: "ninja-coffee-9baea.firebaseapp.com",
  databaseURL: "https://ninja-coffee-9baea.firebaseio.com",
  projectId: "ninja-coffee-9baea",
  storageBucket: "ninja-coffee-9baea.appspot.com",
  messagingSenderId: "771696435203",
  appId: "1:771696435203:web:e6699f74ab340996c7ae36",
  measurementId: "G-YDNDZC260R"
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
var secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");

let firebaseAuth = firebaseApp.auth();


// const createUser = firebase.functions().httpsCallable('createUser');

firebaseApp.firestore().enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
      console.log('Multiple tabs open, persistence can only be enabled')
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
      console.log('The current browser does not support all of the features required to enable persistence');
    }
  });
let firebaseDb = firebaseApp.firestore();

export { firebaseAuth, firebaseDb, secondaryApp }
firebase.analytics();
