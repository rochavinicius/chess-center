import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "process";

var admin = require("firebase-admin");

const firebaseConfig = {
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    projectId: env.projectId,
    storageBucket: env.storageBucket,
    messagingSenderId: env.messagingSenderId,
    appId: env.appId,
    measurementId: env.measurementId,
};

const firebase = initializeApp({credential: admin.credential.cert("./firebase-service-account.json")});
const auth = getAuth(firebase);

export default auth;
