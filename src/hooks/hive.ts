import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { z, ZodError } from "zod";

import { hive_, Hive } from "@/src/schemas/hive";
import { post_ } from "@/src/schemas/post";

export const useHiveQuery = (hiveId: number) => {
  return useQuery<Hive, AxiosError<{ message: string }> | ZodError>({
    queryKey: ["hive", hiveId, "data"],
    queryFn: async () => {
      return await hive_.parseAsync(
        (
          await axios.get("/group_v1/group", {
            baseURL: process.env.EXPO_PUBLIC_GROUP_API,
            params: { group_id: hiveId },
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
      const data = await z.array(hive_).parseAsync(
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

export const useHivePostListInfiniteQuery = (hiveId: number) => {
  return useInfiniteQuery({
    queryKey: ["hive", hiveId, "post", "list"],
    queryFn: async ({ pageParam }) => {
      const data = await z.array(post_).parseAsync(
        (
          await axios.get("/post_v1/groupposts", {
            params: { group_id: hiveId, limit: 24, offset: pageParam },
            baseURL: process.env.EXPO_PUBLIC_GROUP_API,
          })
        ).data,
      );
      const calcPreviousOffset = Math.max(0, pageParam - 24);
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
