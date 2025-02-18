import createInstance from "@/axios/instance";
import { useAuthStore } from "@/store/useAuthStore";
import Cookies from "js-cookie";
declare const isLoggingOut: boolean;

const deleteAllCookies = () => {
  // Get all cookies
  const cookies = document.cookie.split(";");
  const domains = [
    "",
    ".muhamadzafarsyah.com",
    "muhamadzafarsyah.com",
    "www.muhamadzafarsyah.com",
    "api-ecommerce.muhamadzafarsyah.com",
  ];
  const paths = ["/", ""];

  // Iterate through all cookies
  for (const cookie of cookies) {
    const cookieName = cookie.split("=")[0].trim();

    domains.forEach((domain) => {
      paths.forEach((path) => {
        // Using js-cookie
        Cookies.remove(cookieName, {
          domain: domain,
          path: path,
        });

        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=${path}${
          domain ? `; domain=${domain}` : ""
        }`;
      });
    });
  }
};

export const redirectInactiveAccount = () => {
  window.location.href = "/inactive-account";
  useAuthStore.getState().logout();
};

export const logout = async () => {
  try {
    (global as any).isLoggingOut = true;

    try {
      deleteAllCookies();
      // Clear local storage juga (opsional)
      localStorage.clear();
      sessionStorage.clear();
      await createInstance().post("/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    useAuthStore.getState().logout();
    window.location.href = "/auth/login";
  } finally {
    (global as any).isLoggingOut = false;
  }
};
