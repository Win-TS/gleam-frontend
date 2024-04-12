import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { z, ZodError } from "zod";

import {
  hive_,
  extendedHive_,
  hiveWithMemberInfo_,
  HiveWithMemberInfo,
} from "@/src/schemas/hive";
import { useUserStore } from "@/src/stores/user";

export const useHiveQuery = (hiveId: number) => {
  const userStore = useUserStore();

  return useQuery<
    HiveWithMemberInfo,
    AxiosError<{ message: string }> | ZodError
  >({
    queryKey: ["hive", hiveId, "data"],
    queryFn: async () => {
      return await hiveWithMemberInfo_.parseAsync(
        (
          await axios.get("/group_v1/group", {
            baseURL: process.env.EXPO_PUBLIC_GROUP_API,
            params: { group_id: hiveId, user_id: userStore.user?.id ?? 1 },
          })
        ).data,
      );
    },
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
