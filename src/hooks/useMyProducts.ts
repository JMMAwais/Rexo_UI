import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { fetchMyProducts } from "@/lib/sellerApi";

export const MY_PRODUCTS_KEY = ["seller", "products"] as const;

export function useMyProducts() {
  const { user } = useAuth();
  const isSeller = !!user?.roles?.includes("Seller");

  return useQuery({
    queryKey: [...MY_PRODUCTS_KEY, user?.email],
    queryFn: fetchMyProducts,
    enabled: isSeller,
  });
}