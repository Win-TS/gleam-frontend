import { z } from "zod";

import {
  useLoggingInfiniteQuery,
  useLoggingMutation,
  useLoggingQueries,
  useLoggingQuery,
} from "@/src/hooks/query";
import {
  hive_,
  userHive_,
  extendedHiveTagName_,
  hiveWithMemberInfo_,
  hiveMember_,
  hiveRequest_,
  extendedHiveTagId_,
} from "@/src/schemas/hive";
import { tag_ } from "@/src/schemas/tag";
import { useUserId } from "@/src/stores/user";

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
    validator: z.array(extendedHiveTagName_),
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

export const useCreateHiveMutation = () => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "POST_FORM",
    url: "/group_v1/group",
    getMutationRequestParams: ({
      name,
      photo,
      tagId,
      frequency,
      maxMember,
      type,
      visibility,
      description,
    }: {
      name: string;
      photo: string;
      tagId: number;
      frequency: number;
      maxMember: number;
      type: string;
      visibility: boolean;
      description: string;
    }) => {
      return {
        body: {
          group_creator_id: userId,
          group_name: name,
          photo: {
            uri: photo,
            filename: (blob: Blob) =>
              `${userId}_${Date.now()}.${blob.type.split("/")[1]}`,
          },
          tag_id: tagId,
          frequency,
          max_members: maxMember,
          group_type: type,
          visibility,
          description,
        },
      };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    validator: z.any(),
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

export const useEditHiveNameMutation = (hiveId: number) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "PATCH",
    url: "/group_v1/editgroupname",
    query: {
      group_id: hiveId,
    },
    body: {
      member_id: userId,
    },
    getMutationRequestParams: ({ name }: { name: string }) => {
      return { body: { group_name: name } };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    validator: z.any(),
    invalidateKeys: [["hive", hiveId, "data"]],
  });
};

export const useEditHiveDescriptionMutation = (hiveId: number) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "PATCH",
    url: "/group_v1/editgroupdescription",
    query: {
      group_id: hiveId,
      editor_id: userId,
    },
    getMutationRequestParams: ({ description }: { description: string }) => {
      return { query: { description } };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    validator: z.any(),
    invalidateKeys: [["hive", hiveId, "data"]],
  });
};

export const useEditHivePhotoMutation = (hiveId: number) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "PATCH_FORM",
    url: "/group_v1/editgroupphoto",
    query: {
      group_id: hiveId,
    },
    body: { editor_id: userId },
    getMutationRequestParams: ({ photo }: { photo: string }) => {
      return {
        body: {
          photo: {
            uri: photo,
            filename: (blob: Blob) =>
              `${hiveId}_${Date.now()}.${blob.type.split("/")[1]}`,
          },
        },
      };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    validator: z.any(),
    invalidateKeys: [["hive", hiveId, "data"]],
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

export const useHiveByTagQuery = (tagId: number) => {
  return useLoggingQuery({
    url: "/tag_v1/groupswithtag",
    query: { tag_id: tagId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["group", tagId],
    validator: z.array(extendedHiveTagId_),
  });
};

export const useTagByCategoryQuery = (categoryId: number) => {
  return useLoggingQuery({
    url: "/tag_v1/tagbycategory",
    query: { category_id: categoryId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["category", categoryId, "tag", "list"],
    validator: z.array(tag_),
  });
};
