import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { z, ZodError } from "zod";

import {
  hive_,
  extendedHive_,
  hiveWithMemberInfo_,
  HiveWithMemberInfo,
  hiveMember_,
} from "@/src/schemas/hive";
import { useUserId } from "@/src/stores/user";

const getHive = async (hiveId: number, userId: number) => {
  return await hiveWithMemberInfo_.parseAsync(
    (
      await axios.get("/group_v1/group", {
        baseURL: process.env.EXPO_PUBLIC_GROUP_API,
        params: { group_id: hiveId, user_id: userId },
      })
    ).data,
  );
};

export const useHiveQuery = (hiveId: number) => {
  const userId = useUserId({ throw: false });

  return useQuery<
    HiveWithMemberInfo,
    AxiosError<{ message: string }> | ZodError
  >({
    queryKey: ["hive", hiveId, "data", "user", userId],
    queryFn: () => getHive(hiveId, userId!),
    enabled: !!userId,
  });
};

export const useHiveQueries = (hiveIds: number[]) => {
  const userId = useUserId({ throw: false });

  return useQueries({
    queries:
      !!userId && hiveIds
        ? hiveIds.map((hiveId) => {
            return {
              queryKey: ["hive", hiveId, "data", "user", userId],
              queryFn: () => getHive(hiveId, userId),
            };
          })
        : [],
  });
};

export const useHiveListInfiniteQuery = () => {
  return useInfiniteQuery({
    queryKey: ["hive", "list"],
    queryFn: async ({ pageParam }) => {
      const data = await z.array(extendedHive_).parseAsync(
        (
          await axios.get("/group_v1/listgroups", {
            params: { limit: 12, offset: pageParam },
            baseURL: process.env.EXPO_PUBLIC_GROUP_API,
          })
        ).data,
      );
      const calcPreviousOffset = Math.max(0, pageParam - 12);
      const calcNextOffset = pageParam + data.length;
      return {
        data,
        previousOffset:
          calcPreviousOffset !== pageParam ? calcPreviousOffset : undefined,
        nextOffset: calcNextOffset !== pageParam ? calcNextOffset : undefined,
      };
    },
    initialPageParam: 0,
    getPreviousPageParam: (firstPage) => firstPage.previousOffset ?? undefined,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  });
};

export const useSearchHiveListInfiniteQuery = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["hive", "search", search, "list"],
    queryFn: async ({ pageParam }) => {
      const data = await z.array(hive_).parseAsync(
        (
          await axios.get("/group_v1/search", {
            params: { limit: 12, offset: pageParam, groupname: search },
            baseURL: process.env.EXPO_PUBLIC_GROUP_API,
          })
        ).data,
      );
      const calcPreviousOffset = Math.max(0, pageParam - 12);
      const calcNextOffset = pageParam + data.length;
      return {
        data,
        previousOffset:
          calcPreviousOffset !== pageParam ? calcPreviousOffset : undefined,
        nextOffset: calcNextOffset !== pageParam ? calcNextOffset : undefined,
      };
    },
    initialPageParam: 0,
    getPreviousPageParam: (firstPage) => firstPage.previousOffset ?? undefined,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  });
};

export const useHiveMemberListInfiniteQuery = (hiveId: number) => {
  return useInfiniteQuery({
    queryKey: ["hive", hiveId, "member", "list"],
    queryFn: async ({ pageParam }) => {
      const data = await z.array(hiveMember_).parseAsync(
        (
          await axios.get("/group_v1/groupmembers", {
            params: { group_id: hiveId, limit: 12, offset: pageParam },
            baseURL: process.env.EXPO_PUBLIC_GROUP_API,
          })
        ).data,
      );
      const calcPreviousOffset = Math.max(0, pageParam - 12);
      const calcNextOffset = pageParam + data.length;
      return {
        data,
        previousOffset:
          calcPreviousOffset !== pageParam ? calcPreviousOffset : undefined,
        nextOffset: calcNextOffset !== pageParam ? calcNextOffset : undefined,
      };
    },
    initialPageParam: 0,
    getPreviousPageParam: (firstPage) => firstPage.previousOffset ?? undefined,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  });
};

const userHiveList_ = z.object({
  social_groups: z.array(hive_),
  personal_groups: z.array(hive_),
});

export const useUserHiveListQuery = (userId: number) => {
  return useQuery<
    z.infer<typeof userHiveList_>,
    AxiosError<{ message: string }> | ZodError
  >({
    queryKey: ["hive", "user", userId, "list"],
    queryFn: async () => {
      return await userHiveList_.parseAsync(
        (
          await axios.get("/group_v1/usergroups", {
            baseURL: process.env.EXPO_PUBLIC_GROUP_API,
            params: { user_id: userId },
          })
        ).data,
      );
    },
  });
};

export const useDeleteHiveMutation = (hiveId: number) => {
  return useMutation<void, AxiosError<{ message: string }>>({
    mutationFn: async () => {
      return await axios.delete("/group_v1/group", {
        baseURL: process.env.EXPO_PUBLIC_GROUP_API,
        params: {
          group_id: hiveId,
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
        queryKey: ["hive", hiveId, "user", userId, "data"],
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
  return useQuery<any, AxiosError<{ message: string }>>({
    queryKey: ["hive", hiveId, "request"],
    queryFn: async () => {
      return await axios.get("/group_v1/grouprequests", {
        baseURL: process.env.EXPO_PUBLIC_GROUP_API,
        params: { group_id: hiveId, limit: 10, offset: 0 },
      });
    },
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
      return await queryClient.invalidateQueries({
        queryKey: ["hive", hiveId, "request"],
      });
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
      return await queryClient.invalidateQueries({
        queryKey: ["hive", hiveId, "request"],
      });
    },
  });
};
