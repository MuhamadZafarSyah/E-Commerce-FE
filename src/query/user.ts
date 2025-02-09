import createInstance from "@/axios/instance";

export const getUsers = async () => {
  try {
    const response = await createInstance().get("/users");
    const data = response.data;
    return data.data;
  } catch (error) {
    throw error;
  }
};
