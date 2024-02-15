import type { UserInfo } from "firebase/auth";
import { create } from "zustand";

type UserState = {
  user?: UserInfo;
  setUser: (user: UserInfo) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: async (user: UserInfo) => {
    console.log(user);
    set({ user });
  },
}));
