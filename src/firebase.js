import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";

// Configuración PRODUCCIÓN
const firebaseConfig = {
  apiKey: "AIzaSyABvMWIccYCiHVTU7EuRVr8LSqHMm1RPCc",
  authDomain: "ct-tracker-prod.firebaseapp.com",
  projectId: "ct-tracker-prod",
  storageBucket: "ct-tracker-prod.firebasestorage.app",
  messagingSenderId: "698644808912",
  appId: "1:698644808912:web:1965f53b008f95cd9ecad5",
};

// Inicialización
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

// 🔑 CONTROL MANUAL (claro)
const USE_EMULATOR = true; // true

if (USE_EMULATOR) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
