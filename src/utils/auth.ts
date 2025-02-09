import createInstance from "@/axios/instance";
import { useAuthStore } from "@/store/useAuthStore";

// Flag yang dideklarasikan di instance.ts
declare const isLoggingOut: boolean;

export const redirectInactiveAccount = () => {
  window.location.href = "/inactive-account";
  useAuthStore.getState().logout();
};

export const logout = async () => {
  try {
    // Set flag sebelum melakukan request logout
    (global as any).isLoggingOut = true;

    try {
      await createInstance().post("/logout");
    } catch (error) {
      // Ignore logout request errors
      console.error("Logout request failed:", error);
    }

    // Hapus state dan redirect
    useAuthStore.getState().logout();
    window.location.href = "/auth/login";
  } finally {
    // Reset flag setelah selesai
    (global as any).isLoggingOut = false;
  }
};
