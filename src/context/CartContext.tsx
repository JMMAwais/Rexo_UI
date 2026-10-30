import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  addToCartApi,
  fetchMyCart,
  isUuid,
  removeFromCartApi,
  updateCartItemApi,
  type CartData,
  type CartItem,
} from "@/lib/productsApi";

const EMPTY_CART: CartData = { items: [], totalAmount: 0, totalItems: 0 };

export const cartItemKey = (item: Pick<CartItem, "productId" | "variantId">) =>
  `${item.productId}:${item.variantId ?? ""}`;

interface CartContextValue {
  cart: CartData;
  count: number;
  isLoading: boolean;
  adding: boolean;
  isPending: (item: CartItem) => boolean;
  addToCart: (productId: string, quantity?: number, variantId?: string | null) => Promise<boolean>;
  updateQuantity: (item: CartItem, quantity: number) => Promise<void>;
  removeItem: (item: CartItem) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const [adding, setAdding] = useState(false);
  const [pending, setPending] = useState<Set<string>>(new Set());

  const cartKey = useMemo(() => ["cart", user?.email ?? "guest"], [user?.email]);

  const { data: cart = EMPTY_CART, isLoading } = useQuery({
    queryKey: cartKey,
    queryFn: fetchMyCart,
    enabled: !!user,
    staleTime: 60 * 1000,
    retry: 1,
  });

  const goToLogin = useCallback(() => {
    toast.info("Cart ke liye pehle login karein");
    navigate("/login", { state: { from: location } });
  }, [navigate, location]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1, variantId: string | null = null) => {
      if (!isUuid(productId)) {
        toast.info("Ye demo product hai, cart mein add nahi ho sakta");
        return false;
      }
      if (!user) {
        goToLogin();
        return false;
      }
      setAdding(true);
      try {
        await addToCartApi(productId, quantity, variantId);
        await queryClient.invalidateQueries({ queryKey: cartKey });
        toast.success("Cart mein add ho gaya", {
          action: { label: "View Cart", onClick: () => navigate("/cart") },
        });
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Cart mein add nahi ho saka");
        return false;
      } finally {
        setAdding(false);
      }
    },
    [user, goToLogin, queryClient, cartKey, navigate]
  );

  const runOnItem = useCallback(
    async (item: CartItem, action: () => Promise<void>) => {
      const key = cartItemKey(item);
      if (pending.has(key)) return;
      setPending((prev) => new Set(prev).add(key));
      try {
        await action();
        await queryClient.invalidateQueries({ queryKey: cartKey });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Cart update nahi ho saka");
      } finally {
        setPending((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [pending, queryClient, cartKey]
  );

  const updateQuantity = useCallback(
    async (item: CartItem, quantity: number) => {
      if (quantity < 1) return;
      await runOnItem(item, () => updateCartItemApi(item.productId, quantity, item.variantId));
    },
    [runOnItem]
  );

  const removeItem = useCallback(
    async (item: CartItem) => {
      await runOnItem(item, () => removeFromCartApi(item.productId, item.variantId));
    },
    [runOnItem]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart: user ? cart : EMPTY_CART,
      count: user ? cart.totalItems : 0,
      isLoading: !!user && isLoading,
      adding,
      isPending: (item) => pending.has(cartItemKey(item)),
      addToCart,
      updateQuantity,
      removeItem,
    }),
    [user, cart, isLoading, adding, pending, addToCart, updateQuantity, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};