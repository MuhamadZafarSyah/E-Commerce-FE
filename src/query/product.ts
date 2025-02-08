// queries/products.ts
import instance from "@/axios/instance";

export const getProducts = async () => {
  try {
    const res = await instance.get("/products");
    return res.data.data;
  } catch (error) {
    throw error;
  }
};
