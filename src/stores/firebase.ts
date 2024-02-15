import { router } from "expo-router";
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { create } from "zustand";

import { useUserStore } from "./user";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

type FirebaseState = {
  app?: FirebaseApp;
  initialize: () => void;
};

export const useFirebaseStore = create<FirebaseState>((set) => ({
  app: undefined,
  initialize: () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();

    auth.onAuthStateChanged((user) => {
      if (user) {
        useUserStore.setState({
          user: {
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            providerId: user.providerId,
            uid: user.uid,
          },
        });
        router.navigate("/");
      } else {
        router.navigate("/login");
      }
    });
    set({ app });
  },
}));
