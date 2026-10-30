import { useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Banknote, CheckCircle2, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/mock-data";
import { PLACEHOLDER_IMAGE } from "@/lib/productsApi";
import type { PlacedOrder } from "@/lib/ordersApi";

const OrderPlaced = () => {
  const location = useLocation();
  const state = (location.state || {}) as { order?: PlacedOrder; paymentMethod?: string };
  const order = state.order;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  if (!order) return <Navigate to="/products" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl shadow-card p-8 text-center border border-success/20">
            <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-success" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-foreground font-display mb-2">Order Placed!</h1>
            <p className="text-muted-foreground mb-6">
              Thankyou! Your order has been placed. Seller will process it shortly.
            </p>

            <div className="text-left bg-secondary/50 rounded-lg p-5 space-y-3 mb-6">
              <Row label="Order number" value={<span className="font-semibold">{order.orderNumber}</span>} />
              <Row label="Status" value={order.status} />
              <Row
                label="Payment"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5" /> {state.paymentMethod ?? "Cash on Delivery"}
                  </span>
                }
              />
              <Row
                label="Date"
                value={new Date(order.createdAt).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />
            </div>

            {/* Items per seller */}
            <div className="text-left space-y-4 mb-6">
              {order.subOrders.map((sub) => (
                <div key={sub.id} className="border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-2">Sold by {sub.storeName || "Seller"}</p>
                  <div className="space-y-2">
                    {sub.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.productImage ?? PLACEHOLDER_IMAGE}
                          alt={item.productTitle}
                          className="w-10 h-10 rounded-md object-cover bg-secondary"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                        <p className="flex-1 text-sm text-foreground line-clamp-1">{item.productTitle}</p>
                        <span className="text-xs text-muted-foreground">
                          {item.quantity} × {formatPrice(item.unitPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-left space-y-2 text-sm mb-6">
              <Row label="Subtotal" value={formatPrice(order.subTotal)} />
              <Row label="Shipping" value={order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)} />
              {order.discount > 0 && <Row label="Discount" value={`- ${formatPrice(order.discount)}`} />}
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-semibold text-foreground">Pay on delivery</span>
                <span className="font-bold text-foreground text-lg">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full mb-3">
              <Link to={`/orders/${order.id}`}>View Order & Track</Link>
            </Button>

            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/products">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground">{value}</span>
  </div>
);

export default OrderPlaced;