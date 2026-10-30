import { useQuery } from "@tanstack/react-query";
import { fetchNewArrivals } from "@/lib/productsApi";

export function useNewArrivals(limit = 12) {
  return useQuery({
    queryKey: ["home", "new-arrivals", limit],
    queryFn: () => fetchNewArrivals(limit),
    staleTime: 60 * 1000,
  });
}