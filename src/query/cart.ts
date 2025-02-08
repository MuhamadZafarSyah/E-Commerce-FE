import createInstance from "@/axios/instance";

export const updateCartItemQuantity = async (
  productId: number,
  quantityChange: number
) => {
  const instance = createInstance();
  const response = await instance.post("/carts/update-quantity", {
    product_id: productId,
    quantity_change: quantityChange,
  });
  return response.data;
};
