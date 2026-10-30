import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { fetchWishlistIds, isUuid, toggleWishlist } from "@/lib/productsApi";

interface WishlistContextValue {
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const pending = useRef<Set<string>>(new Set());

  const idsKey = useMemo(() => ["wishlist", "ids", user?.email ?? "guest"], [user?.email]);

  const { data: ids = [] } = useQuery({
    queryKey: idsKey,
    queryFn: fetchWishlistIds,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const idSet = useMemo(() => new Set(ids.map((i) => i.toLowerCase())), [ids]);

  const isWishlisted = useCallback(
    (productId: string) => idSet.has(productId.toLowerCase()),
    [idSet]
  );

  const toggle = useCallback(
    async (productId: string) => {
      if (!isUuid(productId)) {
        toast.info("Ye demo product hai, wishlist mein save nahi ho sakta");
        return;
      }
      if (!user) {
        toast.info("Wishlist ke liye pehle login karein");
        navigate("/login", { state: { from: location } });
        return;
      }
      //  prevent duplicate request from Double click 
      if (pending.current.has(productId)) return;
      pending.current.add(productId);

      const prev = queryClient.getQueryData<string[]>(idsKey) ?? [];
      const willAdd = !prev.some((i) => i.toLowerCase() === productId.toLowerCase());

  
      queryClient.setQueryData<string[]>(
        idsKey,
        willAdd ? [...prev, productId] : prev.filter((i) => i.toLowerCase() !== productId.toLowerCase())
      );

      try {
        const res = await toggleWishlist(productId);
        if (!res.success) throw new Error(res.error ?? "Wishlist update nahi ho saki");
        toast.success(res.isWishlisted ? "Wishlist mein add ho gaya" : "Wishlist se hata diya");
        queryClient.invalidateQueries({ queryKey: ["wishlist", "items"] });
      } catch (err) {
        queryClient.setQueryData(idsKey, prev); // wapas purani halat
        toast.error(err instanceof Error ? err.message : "Wishlist update nahi ho saki");
      } finally {
        pending.current.delete(productId);
      }
    },
    [user, idsKey, queryClient, navigate, location]
  );

  const value = useMemo(
    () => ({ isWishlisted, toggle, count: user ? ids.length : 0 }),
    [isWishlisted, toggle, ids.length, user]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};