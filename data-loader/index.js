import firebase from 'firebase';
import fs from 'fs';

//CSERÉLD LE A SAJÁT APPOD CONFIG OBJECTJÉRE!
const firebaseConfig = {
    apiKey: "AIzaSyC5olgZYeUgk77qaov1nSsB5-aBiBXAxLg",
    authDomain: "reddit-clone-82e79.firebaseapp.com",
    projectId: "reddit-clone-82e79",
    storageBucket: "reddit-clone-82e79.appspot.com",
    messagingSenderId: "970395301404",
    appId: "1:970395301404:web:79cf6abb4af788f8d051d9"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

firebase
    .auth()
    .signInAnonymously()
    .then(() => {
        console.log('signed in');
    })
    .catch((error) => {
        console.error(error);
    });

const fileName = './data.json';
let content = [];

fs.readFile(fileName, function read(err, data) {
    if (err) {
        throw err;
    }

    content = JSON.parse(data);
});

firebase.auth().onAuthStateChanged(async (user) => {
    const promises = [];
    if (user) {
        const restaurants = Object.keys(content);

        for (let i = 0; i < restaurants.length; i++) {
            const query = db.collection('restaurant')
                .doc(restaurants[i])
                .set(content[restaurants[i]])
                .then(() => {
                    console.log('Document written');
                })
                .catch((error) => {
                    console.error('Error adding document: ', error);
                });
            promises.push(query);
        }
        Promise.all(promises).then(() => {
            process.exit(0);
        })
    } else {
        console.log('no user');
    }
});

// -----------------------
// A Fenti kódhoz ne nyúlj!
// -----------------------