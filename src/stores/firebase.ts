import { initializeApp, FirebaseApp } from "@firebase/app";
import { getAuth, getIdToken } from "@firebase/auth";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";
import { create } from "zustand";

import { useUserStore } from "@/src/stores/user";

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

const token_ = z.object({
  gleamUserId: z.coerce.number(),
});

export const useFirebaseStore = create<FirebaseState>((set) => ({
  app: undefined,
  initialize: () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();

    auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        try {
          useUserStore.setState({
            mock: false,
            userId: (
              await token_.parseAsync(jwtDecode(await getIdToken(authUser)))
            ).gleamUserId,
          });
          if (
            process.env.EXPO_PUBLIC_NO_AUTH_NAVIGATION === undefined ||
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
        const { mock, userId } = useUserStore.getState();
        useUserStore.setState({
          mock,
          userId: mock ? userId : undefined,
        });
        if (
          process.env.EXPO_PUBLIC_NO_AUTH_NAVIGATION === undefined ||
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
