import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBQWEIaqKEezsh7hhj0j8_sTTYih3XaWtc", // TODO: remove it to .env file
    authDomain: "museum-3b8da.firebaseapp.com",
    projectId: "museum-3b8da",
    storageBucket: "museum-3b8da.firebasestorage.app",
    messagingSenderId: "985284030937",
    appId: "1:985284030937:web:93a8e828767460034429c8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
