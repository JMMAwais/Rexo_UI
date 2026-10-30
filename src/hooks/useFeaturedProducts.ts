import { useQuery } from "@tanstack/react-query";
import { fetchFeatured } from "@/lib/productsApi";

export function useFeaturedProducts(limit = 12) {
  return useQuery({
    queryKey: ["home", "featured", limit],
    queryFn: () => fetchFeatured(limit),
    staleTime: 60 * 1000,
  });
}