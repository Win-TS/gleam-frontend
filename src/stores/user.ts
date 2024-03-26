import { create } from "zustand";

import { User } from "@/src/schemas/user";

type UserState = {
  user?: User;
  setUser: (user: User) => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: async (user: User) => {
    console.log(user);
    set({ user });
  },
}));
