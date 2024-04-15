import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { z, ZodError } from "zod";

import { User, user_ } from "@/src/schemas/user";
import { userprofile_, Userprofile } from "@/src/schemas/userprofile";
import { useUserId } from "@/src/stores/user";

export const useUserQuery = () => {
  const userId = useUserId();

  return useQuery<User, AxiosError<{ message: string }> | ZodError>({
    queryKey: ["user", userId],
    queryFn: async () => {
      return await user_.parseAsync(
        (
          await axios.get("/user_v1/userinfo", {
            baseURL: process.env.EXPO_PUBLIC_USER_API,
            params: { user_id: userId },
          })
        ).data,
      );
    },
  });
};

export const useUserprofileQuery = (userId: number) => {
  return useQuery<Userprofile, AxiosError<{ message: string }> | ZodError>({
    queryKey: ["user", userId, "profile"],
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

export const uploadUserPhotoResponse_ = z.object({
  success: z.boolean(),
  message: z.string(),
  url: z.string(),
});

export const useUserprofileMutation = () => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }> | ZodError,
    { photo: string | undefined; firstname: string; lastname: string }
  >({
    mutationFn: async ({
      photo,
      firstname,
      lastname,
    }: {
      photo: string | undefined;
      firstname: string;
      lastname: string;
    }) => {
      await Promise.all(
        [
          axios.patch(
            "/user_v1/editname",
            { firstname, lastname },
            {
              baseURL: process.env.EXPO_PUBLIC_USER_API,
              params: {
                user_id: userId,
              },
            },
          ),
          photo
            ? (async () => {
                const photoBlob = await (await fetch(photo)).blob();
                const uploadUserPhotoFormData = new FormData();
                uploadUserPhotoFormData.append(
                  "photo",
                  photoBlob,
                  `${userId}_${Date.now()}.${photo.split(";")[0].split("/")[1]}`,
                );
                const { url: photoUrl } =
                  await uploadUserPhotoResponse_.parseAsync(
                    (
                      await axios.post(
                        "/user_v1/uploaduserphoto",
                        uploadUserPhotoFormData,
                        {
                          baseURL: process.env.EXPO_PUBLIC_USER_API,
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        },
                      )
                    ).data,
                  );
                const editPhotoFormData = new FormData();
                editPhotoFormData.append("photo_url", photoUrl);
                await axios.patch("/user_v1/editphoto", editPhotoFormData, {
                  baseURL: process.env.EXPO_PUBLIC_USER_API,
                  params: {
                    user_id: userId,
                  },
                });
              })()
            : undefined,
        ].filter(Boolean),
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["user", userId],
      });
    },
  });
};

export const useUsernameMutation = () => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }>,
    { username: string }
  >({
    mutationFn: async ({ username }) => {
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
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["user", userId],
      });
    },
  });
};

export const useUserPrivateMutation = () => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }>,
    { privateAccount: boolean }
  >({
    mutationFn: async ({ privateAccount }) => {
      const userPrivateFormData = new FormData();
      userPrivateFormData.append("private_account", `${privateAccount}`);
      return await axios.patch(
        "/user_v1/editprivateaccount",
        userPrivateFormData,
        {
          baseURL: process.env.EXPO_PUBLIC_USER_API,
          params: { user_id: userId },
        },
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["user", userId],
      });
    },
  });
};
