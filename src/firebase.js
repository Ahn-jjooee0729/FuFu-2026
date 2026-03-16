import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDajCGPgMf57twSUYP9qazQQuAiLDAUaTw",
  authDomain: "footfall-20261.firebaseapp.com",
  projectId: "footfall-20261",
  storageBucket: "footfall-20261.firebasestorage.app",
  messagingSenderId: "735575199895",
  appId: "1:735575199895:web:4db441f2ef44009455d9d2",
  measurementId: "G-M6JP26J12L"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);