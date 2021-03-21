importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyDo7xr0-tG22yldwClYGTm1cqCRdP1kpEI",
  authDomain: "cart-5bd88.firebaseapp.com",
  databaseURL: "https://cart-5bd88.firebaseio.com",
  projectId: "cart-5bd88",
  storageBucket: "cart-5bd88.appspot.com",
  messagingSenderId: "971671236149",
  appId: "1:971671236149:web:0e275f118ee00b18c98b7c",
  measurementId: "G-R88KE3DEVR"
});

const messaging = firebase.messaging();
//console.log(messaging)
