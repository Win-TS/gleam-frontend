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
type UseUserIdThrowOptions = { throw: false };
type UseUserIdReturnType<Opts extends UseUserIdOptions> =
  Opts extends UseUserIdThrowOptions ? number | undefined : number;

const isOptsThrow = (opts: UseUserIdOptions): opts is UseUserIdThrowOptions => {
  return opts?.throw === false;
};

export const useUserId = <Opts extends UseUserIdOptions>(
  opts?: Opts,
): UseUserIdReturnType<Opts> => {
  const [userId] = useUserStore((state) => [state.userId]);
  if (userId !== undefined) return 5;
  if (!isOptsThrow(opts)) throw Error("user is not logged in");
  return undefined as UseUserIdReturnType<Opts>;
};
