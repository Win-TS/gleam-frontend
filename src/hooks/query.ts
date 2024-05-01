import {
  InfiniteData,
  QueryKey,
  UseMutationResult,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig, isAxiosError } from "axios";
import { defu } from "defu";
import _ from "lodash";
import { Platform } from "react-native";
import { ZodError, ZodType, ZodTypeDef, z } from "zod";

import { fetchLocalUriAsBlob } from "@/src/utils/localUri";

type Requester<
  Query extends unknown,
  Body extends unknown,
  Response extends unknown,
> = (req: {
  url: string;
  query: Query;
  body: Body;
  config?: AxiosRequestConfig<Response>;
}) => Promise<unknown>;
type RequesterQuery<Req extends Requester<any, any, any>> =
  Parameters<Req>[0]["query"];
type RequesterBody<Req extends Requester<any, any, any>> =
  Parameters<Req>[0]["body"];

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
  Query extends object | undefined,
  Req extends Requester<Query, undefined, any>,
  Response extends unknown,
  Def extends ZodTypeDef,
>({
  requester,
  url,
  query,
  config,
  validator,
  default: def,
  queryKey,
  enabled,
}: {
  requester: Req;
  url: string;
  query: Query;
  config: AxiosRequestConfig;
  validator: ZodType<Response, Def, unknown>;
  default?: Response;
  queryKey: QueryKey;
  enabled?: boolean;
}) => {
  return useQuery<
    Response,
    AxiosError<unknown, Partial<RequesterBody<Req>>> | ZodError<unknown>
  >({
    queryKey,
    queryFn: () =>
      requestPromiseValidatorAdapter(
        requester({ url, query, body: undefined, config }),
        validator,
        def,
        (log, err) => console.error(log, url, query, err),
      ),
    enabled,
  });
};

export const useLoggingQueriesInternal = <
  Query extends object | undefined,
  Req extends Requester<Query, undefined, any>,
  ResponseItem extends unknown,
  Def extends ZodTypeDef,
>({
  requester,
  url,
  queries,
  config,
  validator,
  default: def,
  queryKey,
}: {
  requester: Req;
  url: string;
  queries: Query[];
  config: AxiosRequestConfig;
  validator: ZodType<ResponseItem, Def, unknown>;
  default?: ResponseItem;
  queryKey: (query: Query) => QueryKey;
}) => {
  return useQueries<
    {
      queryKey: QueryKey;
      queryFn: () => Promise<ResponseItem>;
    }[],
    UseQueryResult<
      ResponseItem,
      AxiosError<unknown, Partial<RequesterBody<Req>>> | ZodError<unknown>
    >[]
  >({
    queries: queries
      ? queries.map((query) => {
          return {
            queryKey: queryKey(query),
            queryFn: () =>
              requestPromiseValidatorAdapter(
                requester({ url, query, body: undefined, config }),
                validator,
                def,
                (log, err) => console.error(log, url, query, err),
              ),
          };
        })
      : [],
  });
};

export const useLoggingInfiniteQueryInternal = <
  Query extends object | undefined,
  Req extends Requester<Query, undefined, any>,
  Response extends unknown[],
  Def extends ZodTypeDef,
>({
  requester,
  url,
  query,
  config,
  validator,
  default: def,
  queryKey,
  limit,
  enabled,
}: {
  requester: Req;
  url: string;
  query: Query;
  config: AxiosRequestConfig;
  validator: ZodType<Response, Def, unknown>;
  default?: Response;
  queryKey: QueryKey;
  limit?: number;
  enabled?: boolean;
}) => {
  return useInfiniteQuery<
    { data: Response; nextOffset: number | undefined },
    AxiosError<unknown, Partial<RequesterBody<Req>>> | ZodError<unknown>,
    InfiniteData<{ data: Response; nextOffset: number | undefined }>,
    QueryKey,
    number
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const result = await requestPromiseValidatorAdapter(
        requester({
          url,
          query: defu(query, { limit: limit ?? 10, offset: pageParam }),
          body: undefined,
          config,
        }),
        validator,
        def,
        (log, err) => console.error(log, url, query, err),
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

export const useLoggingMutationInternal = <
  Req extends Requester<any, any, any>,
  Response extends unknown,
  Def extends ZodTypeDef,
  GetMutationRequestParamsInput extends unknown = void,
>({
  requester,
  url,
  query,
  body,
  getMutationRequestParams,
  config,
  validator,
  default: def,
  invalidateKeys,
  onSettled,
  onSuccess,
}: {
  requester: Req;
  url: string;
  query?: Partial<RequesterQuery<Req>>;
  body?: Partial<RequesterBody<Req>>;
  getMutationRequestParams?: (input: GetMutationRequestParamsInput) => {
    query?: Partial<RequesterQuery<Req>>;
    body?: Partial<RequesterBody<Req>>;
  };
  config: AxiosRequestConfig;
  validator: ZodType<Response, Def, unknown>;
  default?: Response;
  invalidateKeys?: (string | number)[][];
  onSettled?: (
    data: Response | undefined,
    error:
      | AxiosError<unknown, Partial<RequesterBody<Req>>>
      | ZodError<unknown>
      | null,
    input: GetMutationRequestParamsInput,
  ) => Promise<unknown> | unknown;
  onSuccess?: (
    data: Response,
    input: GetMutationRequestParamsInput,
  ) => Promise<unknown> | unknown;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    Response,
    AxiosError<unknown, Partial<RequesterBody<Req>>> | ZodError<unknown>,
    GetMutationRequestParamsInput
  >({
    mutationFn: (input: GetMutationRequestParamsInput) => {
      const { query: additionalQuery, body: additionalBody } =
        getMutationRequestParams?.(input) ?? {
          query: undefined,
          body: undefined,
        };
      const mergedQuery_ = defu(query, additionalQuery);
      const mergedQuery = _.isEmpty(mergedQuery_) ? undefined : mergedQuery_;
      const mergedBody_ = defu(body, additionalBody);
      const mergedBody = _.isEmpty(mergedBody_) ? undefined : mergedBody_;
      return requestPromiseValidatorAdapter(
        requester({
          url,
          query: mergedQuery,
          body: mergedBody,
          config,
        }),
        validator,
        def,
        (log, err) => console.error(log, url, query, err),
      );
    },
    onSettled: async (data, error, input) => {
      await Promise.all(
        invalidateKeys?.map((key) =>
          queryClient.invalidateQueries({ queryKey: key }),
        ) ?? [],
      );
      return await Promise.resolve(onSettled?.(data, error, input));
    },
    onSuccess: async (data, input) => {
      return await Promise.resolve(onSuccess?.(data, input));
    },
  });
};

const getRequester = async (req: {
  url: string;
  query: object | undefined;
  body: undefined;
  config?: AxiosRequestConfig;
}) => {
  return (await axios.get(req.url, { params: req.query, ...req.config })).data;
};

const postRequester = async (req: {
  url: string;
  query: object | undefined;
  body: object | undefined;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.post(req.url, req.body, { params: req.query, ...req.config })
  ).data;
};

const putRequester = async (req: {
  url: string;
  query: object | undefined;
  body: object | undefined;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.put(req.url, req.body, { params: req.query, ...req.config })
  ).data;
};

const patchRequester = async (req: {
  url: string;
  query: object | undefined;
  body: object | undefined;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.patch(req.url, req.body, { params: req.query, ...req.config })
  ).data;
};

const uriObject_ = z.object({
  uri: z.string(),
  filename: z.union([
    z.string(),
    z.function().args(z.instanceof(Blob)).returns(z.string()),
  ]),
});
type FormObject = Record<
  string,
  string | number | boolean | z.infer<typeof uriObject_>
>;

const objectToFormData = async (obj: FormObject) => {
  const formData = new FormData();
  for (const key in obj) {
    const value = obj[key];
    const maybeUriObjectValue = await uriObject_.safeParseAsync(value);
    if (maybeUriObjectValue.success) {
      const { uri, filename } = maybeUriObjectValue.data;
      const blob = await fetchLocalUriAsBlob(uri);
      const resolvedFilename =
        typeof filename === "string" ? filename : filename(blob);
      if (Platform.OS !== "web") {
        // @ts-ignore
        formData.append(key, {
          uri,
          name: resolvedFilename,
          type: blob.type,
        });
      } else {
        formData.append(key, blob, resolvedFilename);
      }
    } else {
      formData.append(key, value.toString());
    }
  }
  return formData;
};

const postFormRequester = async (req: {
  url: string;
  query: object | undefined;
  body: FormObject | undefined;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.postForm(
      req.url,
      req.body ? await objectToFormData(req.body) : undefined,
      {
        params: req.query,
        ...req.config,
      },
    )
  ).data;
};

const putFormRequester = async (req: {
  url: string;
  query: object | undefined;
  body: FormObject | undefined;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.putForm(
      req.url,
      req.body ? await objectToFormData(req.body) : undefined,
      { params: req.query, ...req.config },
    )
  ).data;
};

const patchFormRequester = async (req: {
  url: string;
  query: object | undefined;
  body: FormObject | undefined;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.patchForm(
      req.url,
      req.body ? await objectToFormData(req.body) : undefined,
      {
        params: req.query,
        ...req.config,
      },
    )
  ).data;
};

const postUrlencodedRequester = async (req: {
  url: string;
  query: object | undefined;
  body: object | undefined;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.post(req.url, req.body, {
      params: req.query,
      ...defu(req.config, {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      }),
    })
  ).data;
};

const putUrlencodedRequester = async (req: {
  url: string;
  query: object | undefined;
  body: object | undefined;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.put(req.url, req.body, {
      params: req.query,
      ...defu(req.config, {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      }),
    })
  ).data;
};

const patchUrlencodedRequester = async (req: {
  url: string;
  query: object | undefined;
  body: object | undefined;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.patch(req.url, req.body, {
      params: req.query,
      ...defu(req.config, {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      }),
    })
  ).data;
};

const deleteRequester = async (req: {
  url: string;
  query: object | undefined;
  body: object | undefined;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.delete(req.url, {
      params: req.query,
      data: req.body,
      ...req.config,
    })
  ).data;
};

const REQUESTERS = {
  GET: getRequester,
  POST: postRequester,
  PUT: putRequester,
  PATCH: patchRequester,
  POST_FORM: postFormRequester,
  PUT_FORM: putFormRequester,
  PATCH_FORM: patchFormRequester,
  POST_URLENCODED: postUrlencodedRequester,
  PUT_URLENCODED: putUrlencodedRequester,
  PATCH_URLENCODED: patchUrlencodedRequester,
  DELETE: deleteRequester,
};
type MethodRequester<Method extends keyof typeof REQUESTERS> =
  (typeof REQUESTERS)[Method];

type OmitRequester<
  Req extends Requester<any, any, any>,
  Query extends unknown,
  Body extends unknown,
  Response extends unknown,
> = Req extends Requester<Query, Body, Response> ? Req : never;

type RequesterFulfilling<
  Query extends unknown,
  Body extends unknown,
  Response extends unknown,
> = {
  [Method in keyof typeof REQUESTERS as OmitRequester<
    MethodRequester<Method>,
    Query,
    Body,
    Response
  > extends never
    ? never
    : Method]: MethodRequester<Method>;
};

export const useLoggingQuery = <
  Response extends unknown,
  Def extends ZodTypeDef,
>({
  method,
  ...params
}: {
  method?: keyof RequesterFulfilling<unknown, undefined, unknown>;
  url: string;
  query: object | undefined;
  config: AxiosRequestConfig<unknown>;
  validator: ZodType<Response, Def, unknown>;
  default?: Response;
  queryKey: QueryKey;
  enabled?: boolean;
}) => {
  return useLoggingQueryInternal({
    requester: REQUESTERS[method ?? "GET"],
    ...params,
  });
};

export const useLoggingQueries = <
  Query extends object | undefined,
  ResponseItem extends unknown,
  Def extends ZodTypeDef,
>({
  method,
  ...params
}: {
  method?: keyof RequesterFulfilling<unknown, undefined, unknown>;
  url: string;
  queries: Query[];
  config: AxiosRequestConfig<unknown>;
  validator: ZodType<ResponseItem, Def, unknown>;
  default?: ResponseItem;
  queryKey: (item: Query) => QueryKey;
}) => {
  return useLoggingQueriesInternal({
    requester: REQUESTERS[method ?? "GET"],
    ...params,
  });
};

export const useLoggingInfiniteQuery = <
  Response extends unknown[],
  Def extends ZodTypeDef,
>({
  method,
  ...params
}: {
  method?: keyof RequesterFulfilling<unknown, undefined, unknown>;
  url: string;
  query: object | undefined;
  config: AxiosRequestConfig;
  validator: ZodType<Response, Def, unknown>;
  default?: Response;
  queryKey: QueryKey;
  limit?: number;
  enabled?: boolean;
}) => {
  return useLoggingInfiniteQueryInternal({
    requester: REQUESTERS[method ?? "GET"],
    ...params,
  });
};

export const useLoggingMutation = <
  Method extends keyof typeof REQUESTERS,
  Response extends unknown,
  Def extends ZodTypeDef,
  GetMutationRequestParamsInput extends unknown = void,
>({
  method,
  ...params
}: {
  method: Method;
  url: string;
  query?: Partial<RequesterQuery<MethodRequester<Method>>>;
  body?: Partial<RequesterBody<MethodRequester<Method>>>;
  getMutationRequestParams?: (input: GetMutationRequestParamsInput) => {
    query?: Partial<RequesterQuery<MethodRequester<Method>>>;
    body?: Partial<RequesterBody<MethodRequester<Method>>>;
  };
  config: AxiosRequestConfig;
  validator: ZodType<Response, Def, unknown>;
  default?: Response;
  invalidateKeys?: (string | number)[][];
  onSettled?: (
    data: Response | undefined,
    error:
      | AxiosError<unknown, Partial<RequesterQuery<MethodRequester<Method>>>>
      | ZodError<unknown>
      | null,
    input: GetMutationRequestParamsInput,
  ) => Promise<unknown> | unknown;
  onSuccess?: (
    data: Response,
    input: GetMutationRequestParamsInput,
  ) => Promise<unknown> | unknown;
}) => {
  return useLoggingMutationInternal({
    requester: REQUESTERS[method],
    ...params,
  });
};

const messageResponse_ = z.object({ message: z.string() });
export const useMutationErrorMessage = (
  mutation: UseMutationResult<any, Error, any, any>,
) => {
  const error = mutation.error;
  if (!error) return undefined;
  if (isAxiosError(error)) {
    const parsed = messageResponse_.safeParse(error.response?.data);
    if (parsed.success) return parsed.data.message;
    else return error.message;
  }
  return error.message;
};
