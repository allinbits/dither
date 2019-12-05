import firebase from "firebase/app";
import "firebase/firestore";

// Get a Firestore instance
export const db = firebase
  .initializeApp({
    apiKey: "AIzaSyBwhML0zwS6Bxg3xZAamCZsjdxp8Omj_p8",
    authDomain: "depthchat.firebaseapp.com",
    databaseURL: "https://depthchat.firebaseio.com",
    projectId: "depthchat",
    storageBucket: "depthchat.appspot.com",
    messagingSenderId: "689660525897",
    appId: "1:689660525897:web:967687c6922411834f2e98",
    measurementId: "G-W0BD948NZ2"
  })
  .firestore();
