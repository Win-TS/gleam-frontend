import { create } from "zustand";

export const useUserStore = create((set) => ({
  token: "",
  setToken: (token: string) => set(() => ({ bears: token })),
}));
