import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAEotgxvQJX3UIAXefVZI6sFAzzWalb6KY",
    authDomain: "test-dbcdb.firebaseapp.com",
    databaseURL: "https://test-dbcdb.firebaseio.com",
    projectId: "test-dbcdb",
    storageBucket: "test-dbcdb.appspot.com",
    messagingSenderId: "929229485671"
};
firebase.initializeApp(config);
const database = firebase.database().ref();
export default database;

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
