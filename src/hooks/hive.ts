import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { z, ZodError } from "zod";

import { hive_, Hive } from "@/src/schemas/hive";

export const useHiveQuery = (hiveId: number) => {
  return useQuery<Hive, AxiosError<{ message: string }> | ZodError>({
    queryKey: ["hive", hiveId],
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
    queryKey: ["hivelist"],
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
