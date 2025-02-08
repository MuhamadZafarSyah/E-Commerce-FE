export type TransactionType = {
  id: number;
  user_id: number;
  fullname: string;
  email: string;
  phone: string;
  total_amount: number;
  shipping_address: string;
  status: string;
  created_at: string;
  payment_url: string;
  updated_at: string;
  items: OrderItemType[];
  reviews?: ReviewType[];
  user: UserType;
};

export type OrderItemType = {
  id: number;
  product: ProductType;
  quantity: number;
  price: number;
};

export type ProductType = {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
};

export type UserType = {
  id: number;
  email: string;
};
export type ReviewType = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  product_id: number;
};
