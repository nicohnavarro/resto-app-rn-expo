import firebase from 'firebase/app'
import 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyAn0rDk8p9pvHwGlWK3KSaW0SbrxbwNJJA",
    authDomain: "nn-restaurants.firebaseapp.com",
    projectId: "nn-restaurants",
    storageBucket: "nn-restaurants.appspot.com",
    messagingSenderId: "1074252796263",
    appId: "1:1074252796263:web:e0b7321ee3efaf95939fc2",
    measurementId: "G-G970H6PH53"
  };
  // Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);