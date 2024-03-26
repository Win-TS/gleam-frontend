import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";

import { userprofile_, Userprofile } from "@/src/schemas/userprofile";

export const useUserprofileQuery = (userId: number) => {
  return useQuery<Userprofile, AxiosError<{ message: string }> | ZodError>({
    queryKey: ["userprofile", userId],
    queryFn: async () => {
      return await userprofile_.parseAsync(
        (
          await axios.get("/user_v1/userprofile", {
            baseURL: process.env.EXPO_PUBLIC_USER_API,
            params: { user_id: userId },
          })
        ).data,
      );
    },
  });
};

export const useNameMutation = (userId: number) => {
  return useMutation<
    void,
    AxiosError<{ message: string }>,
    { firstname: string; lastname: string }
  >({
    mutationFn: async ({
      firstname,
      lastname,
    }: {
      firstname: string;
      lastname: string;
    }) => {
      return await axios.patch(
        "/user_v1/editname",
        { firstname, lastname },
        {
          baseURL: process.env.EXPO_PUBLIC_USER_API,
          params: {
            user_id: userId,
          },
        },
      );
    },
    onSuccess: () => {
      useQueryClient().invalidateQueries({
        queryKey: ["userprofile", userId],
        refetchType: "all",
      });
    },
  });
};

export const useUsernameMutation = (userId: number) => {
  return useMutation<
    void,
    AxiosError<{ message: string }>,
    { username: string }
  >({
    mutationFn: async ({ username }: { username: string }) => {
      return await axios.patch(
        "/user_v1/editusername",
        {},
        {
          baseURL: process.env.EXPO_PUBLIC_USER_API,
          params: {
            user_id: userId,
            new_username: username,
          },
        },
      );
    },
    onSuccess: () => {
      useQueryClient().invalidateQueries({
        queryKey: ["userprofile", userId],
        refetchType: "all",
      });
    },
  });
};
