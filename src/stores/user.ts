import axios from "axios";
import { create } from "zustand";

import { User } from "@/src/schemas/user";

type UserState = {
  mock: boolean;
  user?: User;
  setUser: (user: User) => Promise<void>;
};

const mockUserId = process.env.EXPO_PUBLIC_MOCK_AUTH_USER_ID
  ? parseInt(process.env.EXPO_PUBLIC_MOCK_AUTH_USER_ID, 10)
  : undefined;

export const useUserStore = create<UserState>((set) => ({
  mock: mockUserId !== undefined,
  user: undefined,
  setUser: async (user: User) => {
    console.log(user);
    set({ mock: false, user });
  },
}));

if (mockUserId) {
  axios
    .get("/user_v1/userinfo", {
      params: { user_id: mockUserId },
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    })
    .then(({ data: user }) =>
      useUserStore.setState({
        user,
      }),
    );
}

export const useUserId = () => {
  const [mock, userId] = useUserStore((state) => [state.mock, state.user?.id]);
  if (mock && mockUserId) return mockUserId;
  if (userId === undefined) throw Error("user is not logged in");
  return userId;
};
