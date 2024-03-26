import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";

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
