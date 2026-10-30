import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cartItemKey, useCart } from "@/context/CartContext";
import { PLACEHOLDER_IMAGE } from "@/lib/productsApi";

const Cart = () => {
  const { user } = useAuth();
  const { cart, isLoading, isPending, updateQuantity, removeItem } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8 font-display">Shopping Cart</h1>

        {!user ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Apna cart dekhne ke liye login karein</p>
            <Link to="/login" state={{ from: { pathname: "/cart" } }}>
              <Button>Login</Button>
            </Link>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 rounded-lg bg-secondary animate-pulse" />
            ))}
          </div>
        ) : cart.items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Link to="/products"><Button>Continue Shopping</Button></Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const busy = isPending(item);
                return (
                  <div
                    key={cartItemKey(item)}
                    className={`flex gap-4 p-4 bg-card rounded-lg shadow-card transition-opacity ${busy ? "opacity-60" : ""}`}
                  >
                    <img
                      src={item.productImage ?? PLACEHOLDER_IMAGE}
                      alt={item.productTitle}
                      className="w-20 h-20 rounded-md object-cover bg-secondary"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-sm font-medium text-foreground hover:text-primary line-clamp-1"
                      >
                        {item.productTitle}
                      </Link>
                      {item.variantInfo && (
                        <p className="text-xs text-muted-foreground">{item.variantInfo}</p>
                      )}
                      <p className="text-sm font-bold text-foreground mt-1">{formatPrice(item.unitPrice)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded-md">
                          <button
                            disabled={busy || item.quantity <= 1}
                            onClick={() => updateQuantity(item, item.quantity - 1)}
                            className="p-1 hover:bg-secondary disabled:opacity-40"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs">{item.quantity}</span>
                          <button
                            disabled={busy}
                            onClick={() => updateQuantity(item, item.quantity + 1)}
                            className="p-1 hover:bg-secondary disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-foreground">
                            {formatPrice(item.totalPrice)}
                          </span>
                          <button
                            disabled={busy}
                            onClick={() => removeItem(item)}
                            className="text-destructive hover:text-destructive/80 disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-card rounded-lg shadow-card p-6 h-fit sticky top-24">
              <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items</span><span>{cart.totalItems}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>{formatPrice(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span><span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border text-base">
                  <span>Subtotal</span><span>{formatPrice(cart.totalAmount)}</span>
                </div>
              </div>
              <Link to="/checkout">
                <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;