const firebaseConfig = {
    apiKey: "AIzaSyC9snZ35bOtHBVl59LdAUtrwXkL_6z8xJk",
    authDomain: "sto-monitoring.firebaseapp.com",
    projectId: "sto-monitoring",
    storageBucket: "sto-monitoring.firebasestorage.app",
    messagingSenderId: "180070053972",
    appId: "1:180070053972:web:1a23b7128e98d8332255c1",
    databaseURL: "https://sto-monitoring-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
