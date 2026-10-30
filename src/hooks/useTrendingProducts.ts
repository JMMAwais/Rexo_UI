import { useQuery } from "@tanstack/react-query";
import { fetchTrending } from "@/lib/productsApi";

export function useTrendingProducts(limit = 12) {
  return useQuery({
    queryKey: ["home", "trending", limit],
    queryFn: () => fetchTrending(limit),
    staleTime: 60 * 1000,
  });
}