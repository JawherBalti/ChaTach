import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVJyu6p7numgVwRTlb1B-orJkEaaViYqs",
  authDomain: "chattach-497a1.firebaseapp.com",
  projectId: "chattach-497a1",
  storageBucket: "chattach-497a1.appspot.com",
  messagingSenderId: "334328000251",
  appId: "1:334328000251:web:e379aee3f3a4922648ca5e",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
