import * as Firebase from "firebase/app";
import "firebase/firestore";

function initFirebase() {
  Firebase.initializeApp({
    apiKey: "AIzaSyCkOOMlkKqyk_JUeFik8FA1cjHF571-UP8",
    authDomain: "ditherchat.firebaseapp.com",
    databaseURL: "https://ditherchat.firebaseio.com",
    projectId: "ditherchat",
    storageBucket: "ditherchat.appspot.com",
    messagingSenderId: "187301558478",
    appId: "1:187301558478:web:b68c5a181793205b21f89f",
    measurementId: "G-B7DGW8CBME"
  });
  return new Promise((resolve, reject) => {
    Firebase.firestore()
      .enablePersistence()
      .then(resolve)
      .catch(err => {
        if (err.code === "failed-precondition") {
          reject(err);
          // Multiple tabs open, persistence can only be
          // enabled in one tab at a a time.
        } else if (err.code === "unimplemented") {
          reject(err);
          // The current browser does not support all of
          // the features required to enable persistence
        }
      });
  });
}

export { Firebase, initFirebase };
