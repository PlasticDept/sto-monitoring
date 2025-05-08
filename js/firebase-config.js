const firebaseConfig = {
    apiKey: "AIzaSyBYdbo6du0u3ZxT53lFEXpNccPwTu8czN4",
    authDomain: "incoming-schedule-monitoring.firebaseapp.com",
    databaseURL: "https://incoming-schedule-monitoring-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "incoming-schedule-monitoring",
    storageBucket: "incoming-schedule-monitoring.firebasestorage.app",
    messagingSenderId: "460704037681",
    appId: "1:460704037681:web:2fdbf601beaa8817130e10"
  };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
