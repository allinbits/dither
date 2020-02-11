import * as Firebase from "firebase/app";
import "firebase/firestore";

function initFirebase() {
  Firebase.initializeApp({
    apiKey: "AIzaSyBN-WIpBZXmnuEK6xIMzMX6IEDvOtpR5uc",
    authDomain: "dither-chat.firebaseapp.com",
    databaseURL: "https://dither-chat.firebaseio.com",
    projectId: "dither-chat",
    storageBucket: "dither-chat.appspot.com",
    messagingSenderId: "165753878836",
    appId: "1:165753878836:web:3642734bed0a78ced20d61",
    measurementId: "G-EZHC9P3N4V"
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
