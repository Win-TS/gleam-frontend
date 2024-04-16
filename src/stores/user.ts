import axios from "axios";
import { create } from "zustand";

import { User, user_ } from "@/src/schemas/user";

type UserState = {
  mock: boolean;
  userId?: number;
  setUser: (user: User) => Promise<void>;
};

const mockUserId = process.env.EXPO_PUBLIC_MOCK_AUTH_USER_ID
  ? parseInt(process.env.EXPO_PUBLIC_MOCK_AUTH_USER_ID, 10)
  : undefined;

export const useUserStore = create<UserState>((set) => ({
  mock: mockUserId !== undefined,
  userId: undefined,
  setUser: async (user: User) => {
    console.log(user);
    set({ mock: false, userId: user.id });
  },
}));

if (mockUserId) {
  axios
    .get("/user_v1/userinfo", {
      params: { user_id: mockUserId },
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    })
    .then(({ data }) =>
      useUserStore.setState({
        userId: user_.parse(data).id,
      }),
    );
}

type UseUserIdOptions = { throw: boolean } | undefined;
type UseUserIdReturnType<Opts extends UseUserIdOptions> = Opts extends {
  throw: false;
}
  ? number | undefined
  : number;

export const useUserId = <Opts extends UseUserIdOptions>(
  arg?: Opts,
): UseUserIdReturnType<Opts> => {
  const [mock, userId] = useUserStore((state) => [state.mock, state.userId]);
  if (mock && mockUserId) return mockUserId;
  if (!(arg?.throw === false) && userId === undefined)
    throw Error("user is not logged in");
  // @ts-ignore
  return userId;
};
