// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyDs3JgJCNgE9F39u2iY2QoNrvs3ISXyoas",
  authDomain: "langapp-151e4.firebaseapp.com",
  projectId: "langapp-151e4",
  storageBucket: "langapp-151e4.firebasestorage.app",
  messagingSenderId: "76494221415",
  appId: "1:76494221415:web:5f731f55858d8df852a4c2",
  measurementId: "G-7CB5LXMGZE"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };