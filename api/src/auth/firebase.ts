import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

var admin = require("firebase-admin");

const firebase = initializeApp({
    credential: admin.credential.cert(
        "./firebase-service-account.json"
    ),
});
const auth = getAuth(firebase);

export default auth;
