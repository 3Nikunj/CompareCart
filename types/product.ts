export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  merchant: string;
  url: string;
  rating?: number;
  reviews?: number;
}

export interface SearchResponse {
  shopping: Array<{
    title: string;
    link: string;
    snippet?: string;
    imageUrl?: string;
    price?: string;
    merchant?: {
      name: string;
    };
    rating?: string;
    reviews?: string;
  }>;
}