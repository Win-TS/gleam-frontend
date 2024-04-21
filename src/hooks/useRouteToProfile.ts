import { useRouter } from "expo-router";

import { useUserId } from "@/src/stores/user";

export const useRouteToProfile = (toUserId: number) => {
  const router = useRouter();
  const userId = useUserId();

  return () => {
    if (toUserId === userId) {
      router.push("/(tabs)/profile");
    } else {
      router.push({
        pathname: "/(tabs)/home/profile/[id]/",
        params: {
          id: toUserId,
        },
      });
    }
  };
};
