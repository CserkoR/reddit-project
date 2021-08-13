import firebase from "firebase/app";
import "firebase/auth";

src = "https://www.gstatic.com/firebasejs/8.2.10/firebase-app.js";


const firebaseConfig = {
  apiKey: "AIzaSyC5olgZYeUgk77qaov1nSsB5-aBiBXAxLg",
  authDomain: "reddit-clone-82e79.firebaseapp.com",
  projectId: "reddit-clone-82e79",
  storageBucket: "reddit-clone-82e79.appspot.com",
  messagingSenderId: "970395301404",
  appId: "1:970395301404:web:79cf6abb4af788f8d051d9"
};
firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export default app;