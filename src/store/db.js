import firebase from "firebase/app";
import "firebase/firestore";

// Get a Firestore instance
export const db = firebase
  .initializeApp({
    apiKey: "AIzaSyBkPGw8Dd6a4Jm6qXEX5cDlMB99oLWYsGA",
    authDomain: "cosmos-f530e.firebaseapp.com",
    databaseURL: "https://cosmos-f530e.firebaseio.com",
    projectId: "cosmos-f530e",
    storageBucket: "cosmos-f530e.appspot.com",
    messagingSenderId: "1073115354422",
    appId: "1:1073115354422:web:ee8e27823a28eeff700f97"
  })
  .firestore();
