import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "./graphqlClient";

export interface TopSeller {
  id: string;
  storeName: string;
  storeLogoUrl: string | null;
  productCount: number;
  salesCount: number;
  averageRating: number;
  reviewCount: number;
}

const TOP_SELLERS_QUERY = `
  query TopSellers($limit: Int) {
    topSellers(limit: $limit) {
      id
      storeName
      storeLogoUrl
      productCount
      salesCount
      averageRating
      reviewCount
    }
  }
`;

export async function fetchTopSellers(limit = 8): Promise<TopSeller[]> {
  const res = await graphqlRequest<{ topSellers: TopSeller[] | null }>(TOP_SELLERS_QUERY, { limit });
  return res.topSellers ?? [];
}

export function useTopSellers(limit = 8) {
  return useQuery({
    queryKey: ["home", "top-sellers", limit],
    queryFn: () => fetchTopSellers(limit),
    staleTime: 60 * 1000,
  });
}