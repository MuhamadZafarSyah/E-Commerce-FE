import instance from "@/axios/instance";

export const getProfiles = async () => {
  try {
    const response = await instance.get("/profile");
    const data = response.data;
    return data.data;
  } catch (error) {
    throw error;
  }
};
