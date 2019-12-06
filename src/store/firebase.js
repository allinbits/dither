import * as Firebase from "firebase/app";
import "firebase/firestore";

function initFirebase() {
  Firebase.initializeApp({
    apiKey: "AIzaSyBwhML0zwS6Bxg3xZAamCZsjdxp8Omj_p8",
    authDomain: "depthchat.firebaseapp.com",
    databaseURL: "https://depthchat.firebaseio.com",
    projectId: "depthchat",
    storageBucket: "depthchat.appspot.com",
    messagingSenderId: "689660525897",
    appId: "1:689660525897:web:967687c6922411834f2e98",
    measurementId: "G-W0BD948NZ2"
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
