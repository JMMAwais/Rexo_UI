import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Check, ExternalLink, MapPin, Truck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/mock-data";
import { PLACEHOLDER_IMAGE, isUuid } from "@/lib/productsApi";
import { cancelOrderApi, fetchOrderById } from "@/lib/ordersApi";
import { TIMELINE_STEPS, canCancel, overallStatus, statusBadge, stepIndex } from "@/lib/orderStatus";
import { useAuth } from "@/context/AuthContext";

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["orders", "detail", id],
    queryFn: () => fetchOrderById(id!),
    enabled: !!user && isUuid(id),
  });

  const cancel = useMutation({
    mutationFn: () => cancelOrderApi(id!, "Cancelled by buyer"),
    onSuccess: async () => {
      toast.success("Order cancel ho gaya");
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Order cancel nahi ho saka"),
  });

  const handleCancel = () => {
    if (window.confirm("Kya aap waqai yeh order cancel karna chahte hain?")) cancel.mutate();
  };

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> My Orders
        </Link>
        {children}
      </div>
      <Footer />
    </div>
  );

  if (!user) {
    return (
      <Shell>
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">To review order details, please log in.</p>
          <Link to="/login" state={{ from: { pathname: `/orders/${id}` } }}>
            <Button>Login</Button>
          </Link>
        </div>
      </Shell>
    );
  }

  if (isLoading) {
    return (
      <Shell>
        <div className="h-72 rounded-lg bg-secondary animate-pulse" />
      </Shell>
    );
  }

  if (isError || !order) {
    return (
      <Shell>
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Link to="/orders"><Button variant="outline">Back to My Orders</Button></Link>
        </div>
      </Shell>
    );
  }

  const status = overallStatus(order);
  const addr = order.shippingAddress;

  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusBadge[status] ?? statusBadge.Pending}`}>
            {status}
          </span>
          {canCancel(order) && (
            <Button variant="outline" size="sm" className="text-destructive" onClick={handleCancel} disabled={cancel.isPending}>
              {cancel.isPending ? "Cancelling..." : "Cancel order"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Parcels (seller wise) */}
        <div className="lg:col-span-2 space-y-5">
          {order.subOrders.map((sub, idx) => {
            const done = stepIndex(sub.status);
            const cancelled = sub.status === "Cancelled";
            return (
              <div key={sub.id} className="bg-card rounded-lg shadow-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-foreground">
                    Parcel {idx + 1} · <span className="font-normal text-muted-foreground">Sold by {sub.storeName || "Seller"}</span>
                  </p>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge[sub.status] ?? statusBadge.Pending}`}>
                    {sub.status}
                  </span>
                </div>

                {/* Timeline */}
                {cancelled ? (
                  <p className="text-sm text-destructive mb-4">The parcel has been cancelled.</p>
                ) : (
                  <div className="flex items-center mb-5">
                    {TIMELINE_STEPS.map((step, i) => {
                      const completed = done > i;
                      const current = done === i + 1;
                      return (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 ${
                                completed
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-border text-muted-foreground"
                              } ${current ? "ring-4 ring-primary/20" : ""}`}
                            >
                              {completed ? <Check className="w-4 h-4" /> : i + 1}
                            </div>
                            <span className={`text-[11px] mt-1 ${completed ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                              {step}
                            </span>
                          </div>
                          {i < TIMELINE_STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 mb-5 ${done > i + 1 ? "bg-primary" : "bg-border"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Tracking */}
                {sub.trackingNumber ? (
                  <div className="flex flex-wrap items-center gap-3 p-3 rounded-md bg-primary/5 mb-4 text-sm">
                    <Truck className="w-4 h-4 text-primary" />
                    <span className="text-foreground">
                      Tracking no: <span className="font-semibold">{sub.trackingNumber}</span>
                    </span>
                    {sub.trackingUrl && (
                      <a
                        href={sub.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline ml-auto"
                      >
                        Track parcel <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ) : (
                  !cancelled && (
                    <p className="text-xs text-muted-foreground mb-4">
                      Tracking number will be shared once the order is shipped.
                    </p>
                  )
                )}

                {/* Items */}
                <div className="space-y-3">
                  {sub.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.productImage ?? PLACEHOLDER_IMAGE}
                        alt={item.productTitle}
                        className="w-14 h-14 rounded-md object-cover bg-secondary"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.productId}`} className="text-sm font-medium text-foreground hover:text-primary line-clamp-1">
                          {item.productTitle}
                        </Link>
                        {item.variantInfo && <p className="text-xs text-muted-foreground">{item.variantInfo}</p>}
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="space-y-5">
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>{formatPrice(order.subTotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span><span>- {formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border text-base">
                <span>Total</span><span>{formatPrice(order.totalAmount)}</span>
              </div>
              <p className="text-xs text-muted-foreground pt-1">Payment: Cash on Delivery</p>
            </div>
          </div>

          {addr && (
            <div className="bg-card rounded-lg shadow-card p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Delivery Address
              </h3>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p className="text-foreground font-medium">{addr.fullName}</p>
                <p>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}</p>
                <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                <p>{addr.country}</p>
                <p>{addr.phoneNumber}</p>
              </div>
            </div>
          )}

          {order.notes && (
            <div className="bg-card rounded-lg shadow-card p-5">
              <h3 className="font-semibold text-foreground mb-2">Order notes</h3>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
};

export default OrderDetail;