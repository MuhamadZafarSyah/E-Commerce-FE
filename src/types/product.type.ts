export interface ProductType {
  id: number;
  image: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  slug: string;
  category: string;
  quantity: number;
  total: number;
  avg_rating: number;
  product_id: number;
  weight: number;
  reviews: ReviewType[];
  overview: OverviewType;
}

export type ReviewType = {
  id: number;
  user_image: string;
  fullname: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type OverviewType = {
  avg_rating: number;
  total_reviews: number;
  total_ratings: number;
  rating_distribution: {
    raing: number;
    count: number;
  }[];
};
