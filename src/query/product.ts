// queries/products.ts

import createInstance from "@/axios/instance";

export const getProducts = async () => {
  try {
    const res = await createInstance().get("/products");
    return res.data.data;
  } catch (error) {
    throw error;
  }
};
