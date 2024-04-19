import { useLocalSearchParams } from "expo-router";
import { z } from "zod";

import PageContainer from "@/src/components/PageContainer";
import Post from "@/src/components/Post";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import { usePostQuery } from "@/src/hooks/post";

const params = z.object({
  postId: z.coerce.number(),
});

export default function PostScreen() {
  const { postId } = params.parse(useLocalSearchParams());
  const postQuery = usePostQuery(postId);

  return (
    <PageContainer>
      <QueryPlaceholder
        query={postQuery}
        spinnerSize="large"
        renderData={(data) => <Post post={data.data} />}
      />
    </PageContainer>
  );
}
