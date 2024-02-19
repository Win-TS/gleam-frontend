import axios from "axios";
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

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          await axios.get("/auth_v1/verify", {
            headers: {
              Authorization: await auth.currentUser?.getIdToken(),
            },
            baseURL: process.env.EXPO_PUBLIC_AUTH_API,
          });
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
          if (
            process.env.EXPO_PUBLIC_NO_AUTH_NAVIGATION &&
            !JSON.parse(
              String(process.env.EXPO_PUBLIC_NO_AUTH_NAVIGATION).toLowerCase(),
            )
          ) {
            router.navigate("/home/");
          }
        } catch (error) {
          console.error("verify token failed");
          console.error(error);
          await auth.signOut();
        }
      } else {
        if (
          process.env.EXPO_PUBLIC_NO_AUTH_NAVIGATION &&
          !JSON.parse(
            String(process.env.EXPO_PUBLIC_NO_AUTH_NAVIGATION).toLowerCase(),
          )
        ) {
          router.navigate("/login");
        }
      }
    });
    set({ app });
  },
}));
