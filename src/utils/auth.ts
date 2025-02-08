import createInstance from "@/axios/instance";
import { useAuthStore } from "@/store/useAuthStore";

export const redirectInactiveAccount = () => {
  window.location.href = "/inactive-account";
  useAuthStore.getState().logout();
};

export const logout = async () => {
  try {
    await createInstance().post("/logout");
    useAuthStore.getState().logout();
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
