import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);
export const googleOAuthClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string | undefined;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  void isSupported()
    .then((supported) => {
      if (supported && app) analytics = getAnalytics(app);
    })
    .catch(() => {
      analytics = null;
    });
}

export { app, auth, db };

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean | null | undefined>) {
  if (!analytics) return;
  logEvent(analytics, eventName, params);
}
