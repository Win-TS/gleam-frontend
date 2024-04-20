import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { z, ZodError } from "zod";

import {
  useLoggingGetInfiniteQuery,
  useLoggingGetQueries,
  useLoggingGetQuery,
} from "@/src/hooks/query";
import {
  hive_,
  extendedHive_,
  hiveWithMemberInfo_,
  hiveMember_,
} from "@/src/schemas/hive";
import { useUserId } from "@/src/stores/user";

export const useHiveQuery = (hiveId: number) => {
  const userId = useUserId({ throw: false });

  return useLoggingGetQuery({
    url: "/group_v1/group",
    data: { group_id: hiveId, user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", hiveId, "data", "user", userId],
    validator: hiveWithMemberInfo_,
    enabled: !!userId,
  });
};

export const useHiveQueries = (hiveIds: number[]) => {
  const userId = useUserId({ throw: false });

  return useLoggingGetQueries({
    url: "/group_v1/group",
    data: userId
      ? hiveIds.map((hiveId) => {
          return { group_id: hiveId, user_id: userId };
        })
      : [],
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ({ group_id }) => ["hive", group_id, "data", "user", userId],
    validator: hiveWithMemberInfo_,
  });
};

export const useHiveListInfiniteQuery = () => {
  return useLoggingGetInfiniteQuery({
    url: "/group_v1/listgroups",
    data: {},
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", "list"],
    validator: z.array(extendedHive_),
  });
};

export const useSearchHiveListInfiniteQuery = (search: string) => {
  return useLoggingGetInfiniteQuery({
    url: "/group_v1/search",
    data: { groupname: search },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", "search", search, "list"],
    validator: z.array(hive_),
  });
};

export const useHiveMemberListInfiniteQuery = (hiveId: number) => {
  return useLoggingGetInfiniteQuery({
    url: "/group_v1/search",
    data: { group_id: hiveId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", hiveId, "member", "list"],
    validator: z.array(hiveMember_),
  });
};

const userHiveList_ = z.object({
  social_groups: z.array(hive_),
  personal_groups: z.array(hive_),
});

export const useUserHiveListQuery = (userId: number) => {
  return useLoggingGetQuery({
    url: "/group_v1/usergroups",
    data: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", "user", userId, "list"],
    validator: userHiveList_,
  });
};

export const useDeleteHiveMutation = (hiveId: number, userId: number) => {
  return useMutation<void, AxiosError<{ message: string }>>({
    mutationFn: async () => {
      return await axios.delete("/group_v1/group", {
        baseURL: process.env.EXPO_PUBLIC_GROUP_API,
        params: {
          group_id: hiveId,
          editor_id: userId,
        },
      });
    },
  });
};

export const useRequestHiveMutation = (hiveId: number) => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }>,
    { description: string }
  >({
    mutationFn: async ({ description }) => {
      return await axios.post(
        "/group_v1/requesttojoin",
        { group_id: hiveId, member_id: userId, description },
        {
          baseURL: process.env.EXPO_PUBLIC_GROUP_API,
        },
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["hive", hiveId, "data", "user", userId],
      });
    },
  });
};

export const useEditMemberRoleMutation = (
  hiveId: number,
  memberId: number,
  role: string,
) => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>>({
    mutationFn: async () => {
      return await axios.patch(
        "/group_v1/editmemberrole",
        { editor_id: userId, role },
        {
          baseURL: process.env.EXPO_PUBLIC_GROUP_API,
          params: { group_id: hiveId, member_id: memberId },
        },
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["hive", hiveId, "member", "list"],
      });
    },
  });
};

export const useDeleteHiveMemberMutation = (
  hiveId: number,
  memberId: number,
) => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>>({
    mutationFn: async () => {
      return await axios.delete("/group_v1/groupmember", {
        baseURL: process.env.EXPO_PUBLIC_GROUP_API,
        params: { group_id: hiveId, member_id: memberId, editor_id: userId },
      });
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["hive", hiveId],
      });
    },
  });
};

export const useLeaveHiveMutation = (hiveId: number) => {
  const userId = useUserId();

  return useDeleteHiveMemberMutation(hiveId, userId);
};

export const useHiveInfoMutation = (hiveId: number) => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }> | ZodError,
    { photo: string | undefined; name: string; description: string }
  >({
    mutationFn: async ({ photo, name, description }) => {
      await Promise.all(
        [
          axios.patch(
            "/group_v1/editgroupname",
            { group_name: name, member_id: userId },
            {
              baseURL: process.env.EXPO_PUBLIC_GROUP_API,
              params: {
                group_id: hiveId,
              },
            },
          ),
          axios.patch(
            "/group_v1/editgroupname",
            {},
            {
              baseURL: process.env.EXPO_PUBLIC_GROUP_API,
              params: {
                group_id: hiveId,
                editor_id: userId,
                description,
              },
            },
          ),
          photo
            ? (async () => {
                const photoBlob = await (await fetch(photo)).blob();
                const editPhotoFormData = new FormData();
                editPhotoFormData.append("editor_id", userId.toString());
                editPhotoFormData.append(
                  "photo",
                  photoBlob,
                  `${userId}_${Date.now()}.${photo.split(";")[0].split("/")[1]}`,
                );
                await axios.patch(
                  "/group_v1/editgroupphoto",
                  editPhotoFormData,
                  {
                    baseURL: process.env.EXPO_PUBLIC_GROUP_API,
                    params: {
                      group_id: hiveId,
                    },
                  },
                );
              })()
            : undefined,
        ].filter(Boolean),
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["hive", hiveId, "data"],
      });
    },
  });
};

export const useHiveRequestQuery = (hiveId: number) => {
  return useLoggingGetQuery({
    url: "/group_v1/grouprequests",
    data: { group_id: hiveId, limit: 10, offset: 0 },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", hiveId, "request", "list"],
    validator: z.any(),
  });
};

export const useAcceptHiveRequestMutation = (
  hiveId: number,
  memberId: number,
) => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>>({
    mutationFn: async () => {
      return await axios.post(
        "/group_v1/acceptrequest",
        { group_id: hiveId, member_id: memberId, acceptor_id: userId },
        {
          baseURL: process.env.EXPO_PUBLIC_GROUP_API,
        },
      );
    },
    onSettled: async () => {
      return await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["hive", hiveId, "request"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["hive", "user", userId, "request"],
        }),
      ]);
    },
  });
};

export const useDeclineHiveRequestMutation = (
  hiveId: number,
  memberId: number,
) => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>>({
    mutationFn: async () => {
      return await axios.delete("/group_v1/declinerequest", {
        baseURL: process.env.EXPO_PUBLIC_GROUP_API,
        params: { group_id: hiveId, member_id: memberId, decliner_id: userId },
      });
    },
    onSettled: async () => {
      return await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["hive", hiveId, "request"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["hive", "user", userId, "request"],
        }),
      ]);
    },
  });
};

export const useHiveRequestCountQuery = (hiveId: number) => {
  return useLoggingGetQuery({
    url: "/group_v1/grouprequestscount",
    data: { group_id: hiveId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", hiveId, "request", "count"],
    validator: z.coerce.number(),
  });
};

export const useUserAdminHiveRequestCountQuery = () => {
  const userId = useUserId({ throw: false });

  return useLoggingGetQuery({
    url: "/group_v1/acceptorrequestscount",
    data: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", "user", userId, "request", "count"],
    validator: z.coerce.number(),
    default: 0, // FIXME: no way to really tell if backend error or we do not have requests
    enabled: !!userId,
  });
};
