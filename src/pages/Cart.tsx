import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { products, formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState(
    products.slice(0, 3).map((p) => ({ ...p, quantity: 1 }))
  );

  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8 font-display">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Link to="/products"><Button>Continue Shopping</Button></Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-card rounded-lg shadow-card">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`} className="text-sm font-medium text-foreground hover:text-primary line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{item.seller.name}</p>
                    <p className="text-sm font-bold text-foreground mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border rounded-md">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-secondary"><Minus className="w-3 h-3" /></button>
                        <span className="px-3 text-xs">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-secondary"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-card rounded-lg shadow-card p-6 h-fit sticky top-24">
              <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border text-base">
                  <span>Total</span><span>{formatPrice(total)}</span>
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
