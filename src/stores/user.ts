import { create } from "zustand";

import { User } from "@/src/schemas/user";

type UserState = {
  mock: boolean;
  userId?: number;
  setUser: (user: User) => void;
};

const mockUserId = process.env.EXPO_PUBLIC_MOCK_AUTH_USER_ID
  ? parseInt(process.env.EXPO_PUBLIC_MOCK_AUTH_USER_ID, 10)
  : undefined;

export const useUserStore = create<UserState>((set, get) => ({
  mock: mockUserId !== undefined,
  userId: mockUserId,
  setUser: (user: User) => {
    const { mock, userId } = get();
    const state = {
      mock: user?.id ? false : mock,
      userId: mock ? userId : user?.id,
    } satisfies Partial<UserState>;
    set(state);
    console.log(state);
  },
}));

type UseUserIdOptions = { throw: boolean } | undefined;
type UseUserIdReturnType<Opts extends UseUserIdOptions> = Opts extends {
  throw: false;
}
  ? number | undefined
  : number;

export const useUserId = <Opts extends UseUserIdOptions>(
  arg?: Opts,
): UseUserIdReturnType<Opts> => {
  const [userId] = useUserStore((state) => [state.userId]);
  if (typeof userId === "number") return userId;
  if (!(arg?.throw === false)) throw Error("user is not logged in");
  return undefined as UseUserIdReturnType<Opts>;
};
