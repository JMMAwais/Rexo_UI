import { useQuery } from "@tanstack/react-query";
import { fetchProductDetail, isUuid } from "@/lib/productsApi";

export function useProductDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["product", "detail", id],
    queryFn: () => fetchProductDetail(id!),
    // Purane mock links (/product/p1) par server ko request hi nahi bhejte
    enabled: isUuid(id),
    staleTime: 30 * 1000,
  });
}