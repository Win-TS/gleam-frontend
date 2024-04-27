import {
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { defu } from "defu";
import _ from "lodash";
import { ZodError, ZodType, ZodTypeDef } from "zod";

type Requester<Query extends unknown, Body extends unknown> = (req: {
  url: string;
  query: Query;
  body: Body;
  config?: AxiosRequestConfig<unknown>;
}) => Promise<unknown>;
type RequesterQuery<Req extends Requester<any, any>> =
  Parameters<Req>[0]["query"];
type RequesterBody<Req extends Requester<any, any>> =
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
  Req extends Requester<Query, undefined>,
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
  return useQuery<Response, AxiosError | ZodError>({
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
  Req extends Requester<Query, undefined>,
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
  return useQueries({
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
  Req extends Requester<Query, undefined>,
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
  return useInfiniteQuery({
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
  Req extends Requester<any, any>,
  Query extends Partial<RequesterQuery<Req>>,
  Body extends Partial<RequesterBody<Req>>,
  MutationQuery extends Partial<RequesterQuery<Req>>,
  MutationBody extends Partial<RequesterBody<Req>>,
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
}: {
  requester: Req;
  url: string;
  query?: Query;
  body?: Body;
  getMutationRequestParams?: (input: GetMutationRequestParamsInput) => {
    query?: MutationQuery;
    body?: MutationBody;
  };
  config: AxiosRequestConfig;
  validator: ZodType<Response, Def, unknown>;
  default?: Response;
  invalidateKeys?: (string | number)[][];
}) => {
  const queryClient = useQueryClient();

  return useMutation({
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
    onSettled: () => {
      return Promise.all(
        invalidateKeys?.map((key) =>
          queryClient.invalidateQueries({ queryKey: key }),
        ) ?? [],
      );
    },
  });
};

const getRequester = async <Query extends object | undefined>(req: {
  url: string;
  query: Query;
  body: undefined;
  config?: AxiosRequestConfig;
}) => {
  return (await axios.get(req.url, { params: req.query, ...req.config })).data;
};

const postRequester = async <
  Query extends object | undefined,
  Body extends object | undefined,
>(req: {
  url: string;
  query: Query;
  body: Body;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.post(req.url, req.body, { params: req.query, ...req.config })
  ).data;
};

const putRequester = async <
  Query extends object | undefined,
  Body extends object | undefined,
>(req: {
  url: string;
  query: Query;
  body: Body;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.put(req.url, req.body, { params: req.query, ...req.config })
  ).data;
};

const patchRequester = async <
  Query extends object | undefined,
  Body extends object | undefined,
>(req: {
  url: string;
  query: Query;
  body: Body;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.patch(req.url, req.body, { params: req.query, ...req.config })
  ).data;
};

const postFormRequester = async <
  Query extends object | undefined,
  Body extends object | undefined,
>(req: {
  url: string;
  query: Query;
  body: Body;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.postForm(req.url, req.body, {
      params: req.query,
      ...req.config,
    })
  ).data;
};

const putFormRequester = async <
  Query extends object | undefined,
  Body extends object | undefined,
>(req: {
  url: string;
  query: Query;
  body: Body;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.putForm(req.url, req.body, { params: req.query, ...req.config })
  ).data;
};

const patchFormRequester = async <
  Query extends object | undefined,
  Body extends object | undefined,
>(req: {
  url: string;
  query: Query;
  body: Body;
  config?: AxiosRequestConfig;
}) => {
  return (
    await axios.patchForm(req.url, req.body, {
      params: req.query,
      ...req.config,
    })
  ).data;
};

const deleteRequester = async <
  Query extends object | undefined,
  Body extends object | undefined,
>(req: {
  url: string;
  query: Query;
  body: Body;
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
  DELETE: deleteRequester,
};
type MethodRequester<Method extends keyof typeof REQUESTERS> =
  (typeof REQUESTERS)[Method];

type OmitRequester<
  Req extends Requester<any, any>,
  Query extends unknown,
  Body extends unknown,
> = Req extends Requester<Query, Body> ? Req : never;

type RequesterFulfilling<Query extends unknown, Body extends unknown> = {
  [Method in keyof typeof REQUESTERS as OmitRequester<
    MethodRequester<Method>,
    Query,
    Body
  > extends never
    ? never
    : Method]: MethodRequester<Method>;
};

export const useLoggingQuery = <
  Query extends object | undefined,
  Response extends unknown,
  Def extends ZodTypeDef,
>({
  method,
  ...params
}: {
  method?: keyof RequesterFulfilling<unknown, undefined>;
  url: string;
  query: Query;
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
  method?: keyof RequesterFulfilling<unknown, undefined>;
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
  Query extends object | undefined,
  Response extends unknown[],
  Def extends ZodTypeDef,
>({
  method,
  ...params
}: {
  method?: keyof RequesterFulfilling<unknown, undefined>;
  url: string;
  query: Query;
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
  Query extends Partial<RequesterQuery<MethodRequester<Method>>>,
  Body extends Partial<RequesterBody<MethodRequester<Method>>>,
  MutationQuery extends Partial<RequesterQuery<MethodRequester<Method>>>,
  MutationBody extends Partial<RequesterBody<MethodRequester<Method>>>,
  Response extends unknown,
  Def extends ZodTypeDef,
  GetMutationRequestParamsInput extends unknown = void,
>({
  method,
  ...params
}: {
  method: Method;
  url: string;
  query?: Query;
  body?: Body;
  getMutationRequestParams?: (input: GetMutationRequestParamsInput) => {
    query?: MutationQuery;
    body?: MutationBody;
  };
  config: AxiosRequestConfig;
  validator: ZodType<Response, Def, unknown>;
  default?: Response;
  invalidateKeys?: (string | number)[][];
}) => {
  return useLoggingMutationInternal({
    requester: REQUESTERS[method],
    ...params,
  });
};
