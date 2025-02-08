import createInstance from "@/axios/instance";

export const login = async (email: string, password: string) => {
  const response = await createInstance().post("/login", {
    email,
    password,
  });
  return response.data;
};
