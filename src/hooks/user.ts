import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { z } from "zod";

import {
  useLoggingInfiniteQuery,
  useLoggingMutation,
  useLoggingQuery,
} from "@/src/hooks/query";
import { friendPair_, friend_ } from "@/src/schemas/friend";
import { user_ } from "@/src/schemas/user";
import { userprofile_ } from "@/src/schemas/userprofile";
import { useUserId } from "@/src/stores/user";

export const useUserQuery = () => {
  const userId = useUserId({ throw: false });

  return useLoggingQuery({
    url: "/user_v1/userinfo",
    query: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "info", "all"],
    validator: user_,
    enabled: !!userId,
  });
};

export const useUserprofileQuery = (userId: number) => {
  return useLoggingQuery({
    url: "/user_v1/userprofile",
    query: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "info"],
    validator: userprofile_,
  });
};

export const useEditUserNameMutation = () => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "PATCH",
    url: "/user_v1/editname",
    query: { user_id: userId },
    getMutationRequestParams: ({
      firstname,
      lastname,
    }: {
      firstname: string;
      lastname: string;
    }) => {
      return { body: { firstname, lastname } };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.any(),
    invalidateKeys: [["user", userId, "info"]],
  });
};

export const useUploadUserPhotoMutation = () => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "POST_FORM",
    url: "/user_v1/uploaduserphoto",
    getMutationRequestParams: ({ photo }: { photo: string }) => {
      return {
        body: {
          photo: {
            uri: photo,
            filename: (blob: Blob) =>
              `${userId}_${Date.now()}.${blob.type.split("/")[1]}`,
          },
        },
      };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.object({
      success: z.coerce.boolean(),
      message: z.string(),
      url: z.string(),
    }),
  });
};

export const useEditUserPhotoMutation = () => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "PATCH_FORM",
    url: "/user_v1/editphoto",
    query: { user_id: userId },
    getMutationRequestParams: ({ photoUrl }: { photoUrl: string }) => {
      return {
        body: { photo_url: photoUrl },
      };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.any(),
  });
};

export const useEditUserUsernameMutation = () => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "PATCH",
    url: "/user_v1/editusername",
    query: { user_id: userId },
    getMutationRequestParams: ({ username }: { username: string }) => {
      return { query: { new_username: username } };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.any(),
    invalidateKeys: [["user", userId, "info"]],
  });
};

export const useUserPrivateMutation = () => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "PATCH_FORM",
    url: "/user_v1/editprivateaccount",
    query: { user_id: userId },
    getMutationRequestParams: ({
      privateAccount,
    }: {
      privateAccount: boolean;
    }) => {
      return { body: { private_account: `${privateAccount}` } };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.any(),
    invalidateKeys: [["user", userId, "info"]],
  });
};

export const useFriendStatusQuery = (otherUserId: number) => {
  const userId = useUserId({ throw: false });

  return useLoggingQuery({
    url: "/friend_v1/",
    query: { user_id1: userId, user_id2: otherUserId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "friend", otherUserId],
    validator: z.array(friendPair_),
    default: [], // FIXME: no way to really tell if backend error or we do not have friends
    enabled: !!userId,
  });
};

export const useFriendListInfiniteQuery = (userId: number) => {
  return useLoggingInfiniteQuery({
    url: "/friend_v1/list",
    query: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "friend", "list"],
    validator: z.array(friend_),
  });
};

export const useAddFriendMutation = (otherUserId: number) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "POST",
    url: "/friend_v1/add",
    body: { user_id1: userId, user_id2: otherUserId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.any(),
    invalidateKeys: [["user", userId, "friend", otherUserId]],
  });
};

export const useAcceptFriendMutation = (otherUserId: number) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "PATCH",
    url: "/friend_v1/accept",
    body: { user_id1: otherUserId, user_id2: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.any(),
    invalidateKeys: [
      ["user", userId],
      ["user", otherUserId],
    ],
  });
};

export const useDeclineFriendMutation = (otherUserId: number) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "DELETE",
    url: "/friend_v1/decline",
    body: {
      user_id1: otherUserId,
      user_id2: userId,
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.any(),
    invalidateKeys: [["user", userId, "friend", "pending"]],
  });
};

export const useFriendRequestListInfiniteQuery = () => {
  const userId = useUserId({ throw: false });

  return useLoggingInfiniteQuery({
    url: "/friend_v1/pending",
    query: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "friend", "pending", "list"],
    validator: z.array(user_),
    enabled: !!userId,
  });
};

export const useFriendRequestCountQuery = () => {
  const userId = useUserId({ throw: false });

  return useLoggingQuery({
    url: "/friend_v1/requestcount",
    query: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "friend", "pending", "count"],
    validator: z.coerce.number(),
    enabled: !!userId,
  });
};

export const useSignUpMutation = () => {
  return useLoggingMutation({
    method: "POST_FORM",
    url: "/user_v1/createuser",
    getMutationRequestParams: ({
      photo,
      firstName,
      lastName,
      username,
      email,
      password,
      phoneNumber,
      birthDate,
      gender,
      nationality,
    }: {
      photo: string;
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      password: string;
      phoneNumber: string;
      birthDate: Date;
      gender: string;
      nationality: string;
    }) => {
      return {
        body: {
          photo: {
            uri: photo,
            filename: (blob: Blob) =>
              `${username}_${Date.now()}.${blob.type.split("/")[1]}`,
          },
          firstnaame: firstName,
          lastname: lastName,
          username,
          email,
          password,
          phone_no: `+66${phoneNumber}`,
          birthday: birthDate.toISOString().split("T")[0],
          gender,
          nationality,
        },
      };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.any(),
    onSuccess: async (_, { email, password }) => {
      /*
      router.replace({
        pathname: "/signup/otp",
        params: {
          email,
          password,
        },
      });
      */

      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    },
  });
};
