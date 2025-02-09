import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AuthState = {
  isAuthenticated: boolean;
  user: object | null;
  isLoading: boolean;
  error: string | null;
  login: (user: object) => void;
  logout: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      login: (user: object) =>
        set({
          isAuthenticated: true,
          user,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
        }),
      setIsLoading: (isLoading: boolean) =>
        set({
          isLoading,
        }),
      setError: (error: string | null) =>
        set({
          error,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
