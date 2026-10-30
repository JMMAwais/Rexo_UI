import { useState } from "react";
import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/mock-data";
import { PLACEHOLDER_IMAGE } from "@/lib/productsApi";
import { fetchMyOrders } from "@/lib/ordersApi";
import { overallStatus, statusBadge } from "@/lib/orderStatus";
import { useAuth } from "@/context/AuthContext";

const PAGE_SIZE = 8;

const MyOrders = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", "mine", user?.email ?? "guest", page],
    queryFn: () => fetchMyOrders(page, PAGE_SIZE),
    enabled: !!user,
    placeholderData: keepPreviousData,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-2 font-display">My Orders</h1>
        <p className="text-sm text-muted-foreground mb-8">Apne saare orders aur unka status yahan dekhein</p>

        {!user ? (
          <Empty
            text="Apne orders dekhne ke liye login karein"
            action={
              <Link to="/login" state={{ from: { pathname: "/orders" } }}>
                <Button>Login</Button>
              </Link>
            }
          />
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 rounded-lg bg-secondary animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-center py-20 text-muted-foreground">
            Orders load nahi ho sake. Dobara koshish karein.
          </p>
        ) : !data || data.items.length === 0 ? (
          <Empty
            text="Aap ne abhi tak koi order nahi diya"
            action={
              <Link to="/products">
                <Button>Start Shopping</Button>
              </Link>
            }
          />
        ) : (
          <>
            <div className="space-y-4">
              {data.items.map((order) => {
                const status = overallStatus(order);
                const allItems = order.subOrders.flatMap((s) => s.items);
                const totalQty = allItems.reduce((sum, i) => sum + i.quantity, 0);

                return (
                  <div key={order.id} className="bg-card rounded-lg shadow-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {" · "}
                          {totalQty} item{totalQty === 1 ? "" : "s"}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          statusBadge[status] ?? statusBadge.Pending
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {allItems.slice(0, 4).map((item) => (
                        <img
                          key={item.id}
                          src={item.productImage ?? PLACEHOLDER_IMAGE}
                          alt={item.productTitle}
                          className="w-14 h-14 rounded-md object-cover bg-secondary"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      ))}
                      {allItems.length > 4 && (
                        <span className="text-xs text-muted-foreground">+{allItems.length - 4} more</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Total <span className="font-bold text-foreground">{formatPrice(order.totalAmount)}</span>
                      </p>
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">View details</Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Button variant="outline" size="sm" disabled={!data.hasPrevious} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {data.pageNumber} of {data.totalPages}
                </span>
                <Button variant="outline" size="sm" disabled={!data.hasNext} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

const Empty = ({ text, action }: { text: string; action: React.ReactNode }) => (
  <div className="text-center py-20">
    <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
    <p className="text-muted-foreground mb-4">{text}</p>
    {action}
  </div>
);

export default MyOrders;