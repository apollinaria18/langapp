import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDs3JgJCNgE9F39u2iY2QoNrvs3ISXyoas",
  authDomain: "langapp-151e4.firebaseapp.com",
  projectId: "langapp-151e4",
  storageBucket: "langapp-151e4.firebasestorage.app",
  messagingSenderId: "76494221415",
  appId: "1:76494221415:web:96d8c5862716a8f552a4c2",
  measurementId: "G-S861Q77PJ8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
