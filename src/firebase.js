import * as firebase from "firebase";
 var config = {
    apiKey: "AIzaSyD5Caa_WfsxYzq1rExupNAeD9rBqAtIi5M",
    authDomain: "dbchallenger-a858c.firebaseapp.com",
    databaseURL: "https://dbchallenger-a858c.firebaseio.com",
    projectId: "dbchallenger-a858c",
    storageBucket: "dbchallenger-a858c.appspot.com",
    messagingSenderId: "165521708862"
  };
firebase.initializeApp(config);
export const firebaseAuth = firebase.auth()
export const firebaseDatabase = firebase.database();
export default firebase