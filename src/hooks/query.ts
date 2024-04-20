import {
  QueryKey,
  useInfiniteQuery,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ZodError, ZodType, ZodTypeDef } from "zod";

const requestPromiseValidatorAdapter = async <
  Response extends unknown,
  Def extends ZodTypeDef,
>(
  requestPromise: Promise<unknown>,
  validator: ZodType<Response, Def, unknown>,
  def: Response | undefined,
  logger: (log: string, err: unknown) => void,
) => {
  let response: unknown;
  try {
    response = await requestPromise;
  } catch (err) {
    logger("error querying", err);
    if (def === undefined) throw err;
    return def;
  }
  try {
    return await validator.parseAsync(response);
  } catch (err) {
    logger("error validating", err);
    throw err;
  }
};

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
    queryFn: () =>
      requestPromiseValidatorAdapter(
        requester(url, data, config),
        validator,
        def,
        (log, err) => console.error(log, url, data, err),
      ),
    enabled,
  });
};

export const useLoggingQueriesInternal = <
  ResponseItem extends unknown,
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
  validator: ZodType<ResponseItem, Def, unknown>;
  default?: ResponseItem;
  queryKey: (item: Data) => QueryKey;
}) => {
  return useQueries({
    queries: data
      ? data.map((item) => {
          return {
            queryKey: queryKey(item),
            queryFn: () =>
              requestPromiseValidatorAdapter(
                requester(url, item, config),
                validator,
                def,
                (log, err) => console.error(log, url, item, err),
              ),
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
      const result = await requestPromiseValidatorAdapter(
        requester(
          url,
          { ...data, limit: limit ?? 10, offset: pageParam },
          config,
        ),
        validator,
        def,
        (log, err) => console.error(log, url, data, err),
      );
      return {
        data: result,
        nextOffset: result ? pageParam + result.length : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    gcTime: 5,
    enabled,
  });
};

const getRequester = async <Data extends unknown>(
  url: string,
  data?: Data,
  config?: AxiosRequestConfig<Data>,
) => {
  return (await axios.get(url, { params: data, ...config })).data;
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
    requester: getRequester,
    ...params,
  });
};

export const useLoggingGetQueries = <
  ResponseItem extends unknown,
  Data extends unknown,
  Def extends ZodTypeDef,
>(params: {
  url: string;
  data: Data[];
  config: AxiosRequestConfig<Data>;
  validator: ZodType<ResponseItem, Def, unknown>;
  default?: ResponseItem;
  queryKey: (item: Data) => QueryKey;
}) => {
  return useLoggingQueriesInternal({
    requester: getRequester,
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
    requester: getRequester,
    ...params,
  });
};
