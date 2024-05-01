import { FirebaseError } from "@firebase/app";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { useLoggingMutation } from "@/src/hooks/query";
import { authUser_ } from "@/src/schemas/auth";

export const useSignInMutation = () => {
  return useMutation<
    undefined,
    FirebaseError,
    { email: string; password: string }
  >({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    },
  });
};

export const useFindAuthUserByEmailMutation = () => {
  return useLoggingMutation({
    method: "GET",
    url: "/auth_v1/find/email",
    getMutationRequestParams: ({ email }: { email: string }) => {
      return {
        query: { email },
      };
    },
    config: { baseURL: process.env.EXPO_PUBLIC_AUTH_API },
    validator: authUser_,
  });
};

export const useUpdatePasswordMutation = () => {
  return useLoggingMutation({
    method: "PUT_URLENCODED",
    url: "/auth_v1/update-password",
    getMutationRequestParams: ({
      uid,
      password,
    }: {
      uid: string;
      password: string;
    }) => {
      return {
        body: { uid, password },
      };
    },
    config: { baseURL: process.env.EXPO_PUBLIC_AUTH_API },
    validator: z.any(),
  });
};
