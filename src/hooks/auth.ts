import { FirebaseError } from "@firebase/app";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { useMutation } from "@tanstack/react-query";

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
