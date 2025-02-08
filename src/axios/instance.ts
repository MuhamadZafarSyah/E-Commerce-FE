// // utils/axios.ts
// import axios from "axios";

// const headers = {
//   Accept: "application/json",
//   "Content-type": "application/json",
// };

// const instance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
//   headers,
//   withCredentials: true,
//   timeout: 60 * 1000,
// });

// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       return Promise.reject("Unauthorized");
//     }
//     return Promise.reject(error);
//   }
// );

// instance.interceptors.request.use(
//   (config) => config,
//   (error) => Promise.reject(error)
// );

// export default instance;

import { logout, redirectInactiveAccount } from "@/utils/auth";
import axios from "axios";

const headers = {
  Accept: "application/json",
  "Content-type": "application/json",
};

import { GetServerSidePropsContext } from "next";

const createInstance = (context: GetServerSidePropsContext | null = null) => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers,
    withCredentials: true,
    timeout: 60 * 1000,
  });

  if (context) {
    const cookie = context.req.headers.cookie;
    if (cookie) {
      instance.defaults.headers.common["Cookie"] = cookie;
    }
  }

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const isInactiveAccount =
        (error.response?.status === 403 &&
          error.response?.data?.error === "Your account is inactive") ||
        error.response?.headers["x-account-status"] === "inactive";
      if (isInactiveAccount) {
        redirectInactiveAccount();
      }

      const Unauthorized =
        error.response?.status === 401 &&
        error.response?.data?.message === "Unauthorized";
      if (Unauthorized) {
        logout();
      }
      if (error.response?.status === 401) {
        return Promise.reject("Unauthorized");
      }
      return Promise.reject(error);
    }
  );

  instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  return instance;
};

export default createInstance;
