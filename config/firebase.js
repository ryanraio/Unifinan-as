import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAIcUioyzRx2RbJVpFO4TbkNG2dYsJpyRA",
  authDomain: "react-native-login-9fab8.firebaseapp.com",
  projectId: "react-native-login-9fab8",
  storageBucket: "react-native-login-9fab8",
  messagingSenderId: "260735097520",
  appId: "1:260735097520:web:552d4c405ea8c4452a3975",
  measurementId: "G-SWVMQR7GNJ"
};

// Verifica se o Firebase já foi inicializado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Inicializa o Firebase Auth com persistência usando AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Inicializa o Analytics se for suportado
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});
