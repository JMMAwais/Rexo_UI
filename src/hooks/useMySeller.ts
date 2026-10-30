import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { fetchMySeller } from "@/lib/sellerApi";

/**
 * Logged-in seller ka apna store (name, status wagera).
 * Query key mein user ki email hai, taake logout/login ke baad purane seller ka data na dikhe.
 */
export function useMySeller() {
  const { user } = useAuth();
  const isSeller = !!user?.roles?.includes("Seller");

  return useQuery({
    queryKey: ["seller", "me", user?.email],
    queryFn: fetchMySeller,
    enabled: isSeller,
    staleTime: 5 * 60 * 1000,
  });
}