import firebase from 'firebase/app'
import "firebase/auth"

const config = firebase.initializeApp({
    apiKey: "AIzaSyA2arNfhfu6WbucBpZdiQFanesgq8GaC8I",
    authDomain: "a-blog-1e0eb.firebaseapp.com",
    projectId: "a-blog-1e0eb",
    storageBucket: "a-blog-1e0eb.appspot.com",
    messagingSenderId: "360659491247",
    appId: "1:360659491247:web:4bef9b499c39f7be44375a",
    measurementId: "G-RL3J7HZ48R"
});

export const auth = config.auth()
export default config