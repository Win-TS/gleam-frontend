import {
  QueryKey,
  useInfiniteQuery,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ZodError, ZodType, ZodTypeDef } from "zod";

export const useLoggingQueryInternal = <
  Response extends unknown,
  Data extends unknown,
  Def extends ZodTypeDef,
>({
  requester,
  url,
  data,
  config,
  validator,
  default: def,
  queryKey,
  enabled,
}: {
  requester: (
    url: string,
    data?: Data,
    config?: AxiosRequestConfig<Data>,
  ) => Promise<unknown>;
  url: string;
  data: Data;
  config: AxiosRequestConfig<Data>;
  validator: ZodType<Response, Def, unknown>;
  default?: Response;
  queryKey: QueryKey;
  enabled?: boolean;
}) => {
  return useQuery<Response, AxiosError | ZodError>({
    queryKey,
    queryFn: async () => {
      let response: unknown;
      try {
        response = await requester(url, data, config);
      } catch (err) {
        console.error("error querying", url, data, err);
        if (def === undefined) throw err;
        return def;
      }
      try {
        return await validator.parseAsync(response);
      } catch (err) {
        console.error("error validating", url, data, err);
        throw err;
      }
    },
    enabled,
  });
};

export const useLoggingQueriesInternal = <
  Response extends unknown[],
  Data extends unknown,
  Def extends ZodTypeDef,
>({
  requester,
  url,
  data,
  config,
  validator,
  default: def,
  queryKey,
}: {
  requester: (
    url: string,
    data?: Data,
    config?: AxiosRequestConfig<Data>,
  ) => Promise<unknown>;
  url: string;
  data: Data[];
  config: AxiosRequestConfig<Data>;
  validator: ZodType<Response[number], Def, unknown>;
  default?: Response[number];
  queryKey: (item: Data) => QueryKey;
}) => {
  return useQueries({
    queries: data
      ? data.map((item) => {
          return {
            queryKey: queryKey(item),
            queryFn: async () => {
              let response: unknown;
              try {
                response = await requester(url, item, config);
              } catch (err) {
                console.error("error querying", url, item, err);
                if (def === undefined) throw err;
                return def;
              }
              try {
                return await validator.parseAsync(response);
              } catch (err) {
                console.error("error validating", url, item, err);
                throw err;
              }
            },
          };
        })
      : [],
  });
};

export const useLoggingInfiniteQueryInternal = <
  Response extends unknown[],
  Data extends object,
  Def extends ZodTypeDef,
>({
  requester,
  url,
  data,
  config,
  validator,
  default: def,
  queryKey,
  limit,
  enabled,
}: {
  requester: (
    url: string,
    data?: Data & { limit: number; offset: number },
    config?: AxiosRequestConfig<Data>,
  ) => Promise<unknown>;
  url: string;
  data: Data;
  config: AxiosRequestConfig<Data>;
  validator: ZodType<Response, Def, unknown>;
  default?: Response;
  queryKey: QueryKey;
  limit?: number;
  enabled?: boolean;
}) => {
  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      let response: unknown;
      try {
        response = await requester(
          url,
          { ...data, limit: limit ?? 10, offset: pageParam },
          config,
        );
      } catch (err) {
        console.error("error querying", url, data, err);
        if (def === undefined) throw err;
        return {
          data: def,
          nextOffset: pageParam + def.length,
        };
      }
      try {
        const parsed = await validator.parseAsync(response);
        return {
          data: parsed,
          nextOffset: parsed ? pageParam + parsed.length : undefined,
        };
      } catch (err) {
        console.error("error validating", url, data, err);
        throw err;
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    gcTime: 5,
    enabled,
  });
};

export const useLoggingGetQuery = <
  Response extends unknown,
  Data extends unknown,
  Def extends ZodTypeDef,
>(params: {
  url: string;
  data: Data;
  config: AxiosRequestConfig<Data>;
  validator: ZodType<Response, Def, unknown>;
  default?: Response;
  queryKey: QueryKey;
  enabled?: boolean;
}) => {
  return useLoggingQueryInternal({
    requester: async (
      url: string,
      data?: Data,
      config?: AxiosRequestConfig<Data>,
    ) => {
      return (await axios.get(url, { params: data, ...config })).data;
    },
    ...params,
  });
};

export const useLoggingGetQueries = <
  Response extends unknown[],
  Data extends unknown,
  Def extends ZodTypeDef,
>(params: {
  url: string;
  data: Data[];
  config: AxiosRequestConfig<Data>;
  validator: ZodType<Response[number], Def, unknown>;
  default?: Response[number];
  queryKey: (item: Data) => QueryKey;
}) => {
  return useLoggingQueriesInternal({
    requester: async (
      url: string,
      data?: Data,
      config?: AxiosRequestConfig<Data>,
    ) => {
      return (await axios.get(url, { params: data, ...config })).data;
    },
    ...params,
  });
};

export const useLoggingGetInfiniteQuery = <
  Response extends unknown[],
  Data extends object,
  Def extends ZodTypeDef,
>(params: {
  url: string;
  data: Data;
  config: AxiosRequestConfig<Data>;
  validator: ZodType<Response, Def, unknown>;
  default?: Response;
  queryKey: QueryKey;
  limit?: number;
  enabled?: boolean;
}) => {
  return useLoggingInfiniteQueryInternal({
    requester: async (
      url: string,
      data?: Data,
      config?: AxiosRequestConfig<Data>,
    ) => {
      return (await axios.get(url, { params: data, ...config })).data;
    },
    ...params,
  });
};
