import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase/app";
import 'firebase/analytics'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyATaY3O7un_08JHufKSLceJh0grjjQEurc",
  authDomain: "chatroomapp1122131.firebaseapp.com",
  projectId: "chatroomapp1122131",
  storageBucket: "chatroomapp1122131.appspot.com",
  messagingSenderId: "785518709514",
  appId: "1:785518709514:web:62fd925551c86f96e6c8f3",
  measurementId: "G-G3EKS4TJWJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
