import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { z, ZodError } from "zod";

import {
  useLoggingInfiniteQuery,
  useLoggingMutation,
  useLoggingQueries,
  useLoggingQuery,
} from "@/src/hooks/query";
import {
  hive_,
  userHive_,
  extendedHive_,
  hiveWithMemberInfo_,
  hiveMember_,
  hiveRequest_,
} from "@/src/schemas/hive";
import { useUserId } from "@/src/stores/user";
import { fetchUriAsBlob } from "@/src/utils/fetchUriAsBlob";

export const useHiveQuery = (hiveId: number) => {
  const userId = useUserId({ throw: false });

  return useLoggingQuery({
    url: "/group_v1/group",
    query: { group_id: hiveId, user_id: userId },
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

  return useLoggingQueries({
    url: "/group_v1/group",
    queries: userId
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
  return useLoggingInfiniteQuery({
    url: "/group_v1/listgroups",
    query: {},
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", "list"],
    validator: z.array(extendedHive_),
  });
};

export const useSearchHiveListInfiniteQuery = (search: string) => {
  return useLoggingInfiniteQuery({
    url: "/group_v1/search",
    query: { groupname: search },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", "search", search, "list"],
    validator: z.array(hive_),
  });
};

export const useHiveMemberListInfiniteQuery = (hiveId: number) => {
  return useLoggingInfiniteQuery({
    url: "/group_v1/groupmembers",
    query: { group_id: hiveId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", hiveId, "member", "list"],
    validator: z.array(hiveMember_),
  });
};

const userHiveList_ = z.object({
  social_groups: z.array(userHive_),
  personal_groups: z.array(userHive_),
});

export const useUserHiveListQuery = (userId: number) => {
  return useLoggingQuery({
    url: "/group_v1/usergroups",
    query: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", "user", userId, "list"],
    validator: userHiveList_,
  });
};

export const useDeleteHiveMutation = (hiveId: number, userId: number) => {
  return useLoggingMutation({
    method: "DELETE",
    url: "/group_v1/group",
    query: {
      group_id: hiveId,
      editor_id: userId,
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    validator: z.any(),
  });
};

export const useRequestHiveMutation = (hiveId: number) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "POST",
    url: "/group_v1/requesttojoin",
    body: { group_id: hiveId, member_id: userId },
    getMutationRequestParams: ({ description }: { description: string }) => {
      return { body: { description } };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    validator: z.any(),
    invalidateKeys: [["hive", hiveId, "data", "user", userId]],
  });
};

export const useEditMemberRoleMutation = (
  hiveId: number,
  memberId: number,
  role: string,
) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "PATCH",
    url: "/group_v1/editmemberrole",
    query: { group_id: hiveId, member_id: memberId },
    body: { editor_id: userId, role },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    validator: z.any(),
    invalidateKeys: [["hive", hiveId, "member", "list"]],
  });
};

export const useDeleteHiveMemberMutation = (
  hiveId: number,
  memberId: number,
) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "DELETE",
    url: "/group_v1/groupmember",
    query: {
      group_id: hiveId,
      member_id: memberId,
      editor_id: userId,
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    validator: z.any(),
    invalidateKeys: [["hive", hiveId]],
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
                const photoBlob = await fetchUriAsBlob(photo);
                const editPhotoFormData = new FormData();
                editPhotoFormData.append("editor_id", userId.toString());
                // @ts-ignore
                editPhotoFormData.append("photo", {
                  uri: photo,
                  name: `${hiveId}_${Date.now()}.${photoBlob.type.split("/")[1]}`,
                  type: photoBlob.type,
                });
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

export const useHiveRequestListInfiniteQuery = (hiveId: number) => {
  return useLoggingInfiniteQuery({
    url: "/group_v1/grouprequests",
    query: { group_id: hiveId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", hiveId, "request", "list"],
    validator: z.array(hiveRequest_),
  });
};

export const useAcceptHiveRequestMutation = (
  hiveId: number,
  memberId: number,
) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "POST",
    url: "/group_v1/acceptrequest",
    body: { group_id: hiveId, member_id: memberId, acceptor_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    validator: z.any(),
    invalidateKeys: [
      ["hive", hiveId, "request"],
      ["hive", "user", userId, "request"],
    ],
  });
};

export const useDeclineHiveRequestMutation = (
  hiveId: number,
  memberId: number,
) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "DELETE",
    url: "/group_v1/declinerequest",
    query: {
      group_id: hiveId,
      member_id: memberId,
      decliner_id: userId,
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    validator: z.any(),
    invalidateKeys: [
      ["hive", hiveId, "request"],
      ["hive", "user", userId, "request"],
    ],
  });
};

export const useHiveRequestCountQuery = (hiveId: number) => {
  return useLoggingQuery({
    url: "/group_v1/grouprequestscount",
    query: { group_id: hiveId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", hiveId, "request", "count"],
    validator: z.coerce.number(),
  });
};

export const useUserAdminHiveRequestCountQuery = () => {
  const userId = useUserId({ throw: false });

  return useLoggingQuery({
    url: "/group_v1/acceptorrequestscount",
    query: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["hive", "user", userId, "request", "count"],
    validator: z.coerce.number(),
    default: 0, // FIXME: no way to really tell if backend error or we do not have requests
    enabled: !!userId,
  });
};
