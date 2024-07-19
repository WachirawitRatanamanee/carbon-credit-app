// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5x-rZyw_rXB61YmMuOC76Wxc8OvDBwxc",
  authDomain: "carbon-credit-6739d.firebaseapp.com",
  projectId: "carbon-credit-6739d",
  storageBucket: "carbon-credit-6739d.appspot.com",
  messagingSenderId: "339705240657",
  appId: "1:339705240657:web:a4398f430378ad69feac70",
  databaseURL:
    "https://carbon-credit-6739d-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(
    ReactNativeAsyncStorage
  ),
});

export { auth, database };
