import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { Plus, TrendingUp, DollarSign, ShoppingCart, Package, Clock, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useMySeller } from "@/hooks/useMySeller";
import { useMyProducts } from "@/hooks/useMyProducts";
import { formatPrice } from "@/lib/mock-data";
import { SELLER_ORDERS_KEY, fetchSellerOrdersSummary } from "@/lib/sellerOrdersApi";

interface StatCard {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  note?: string;
}

const statusColor: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  Confirmed: "bg-warning/10 text-warning",
  Processing: "bg-primary/10 text-primary",
  Shipped: "bg-accent/10 text-accent",
  Delivered: "bg-success/10 text-success",
  Cancelled: "bg-destructive/10 text-destructive",
};

const SellerDashboard = () => {
  const { data: seller, isLoading } = useMySeller();
  const { data: products, isLoading: productsLoading } = useMyProducts();

  
  const {
    data: summary,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery({
    queryKey: [...SELLER_ORDERS_KEY, "summary"],
    queryFn: () => fetchSellerOrdersSummary(100),
  });

  
  const rows = useMemo(
    () =>
      (summary?.orders ?? [])
        .filter((o) => o.subOrders.length > 0)
        .map((o) => ({ order: o, sub: o.subOrders[0] })),
    [summary]
  );

  const totalOrders = summary?.totalCount ?? 0;
  const truncated = totalOrders > rows.length;

  const deliveredRevenue = rows
    .filter((r) => r.sub.status === "Delivered")
    .reduce((sum, r) => sum + r.sub.subTotal, 0);

  const inProgressAmount = rows
    .filter((r) => r.sub.status !== "Delivered" && r.sub.status !== "Cancelled")
    .reduce((sum, r) => sum + r.sub.subTotal, 0);

  const awaitingAction = rows.filter((r) =>
    ["Pending", "Confirmed", "Processing"].includes(r.sub.status)
  ).length;

  const recent = rows.slice(0, 5);

  const productCount = products?.length ?? 0;
  const publishedCount =
    products?.filter((p) => p.status.toLowerCase() === "published").length ?? 0;

  const stats: StatCard[] = [
    {
      label: "Total Revenue",
      value: ordersLoading ? "..." : formatPrice(deliveredRevenue),
      icon: DollarSign,
      note: ordersLoading
        ? undefined
        : truncated
          ? `last ${rows.length} orders`
          : `${formatPrice(inProgressAmount)} in progress`,
    },
    {
      label: "Orders",
      value: ordersLoading ? "..." : String(totalOrders),
      icon: ShoppingCart,
    },
    {
      label: "Products",
      value: productsLoading ? "..." : String(productCount),
      icon: Package,
      note: productsLoading ? undefined : `${publishedCount} published`,
    },
    {
      label: "Awaiting Action",
      value: ordersLoading ? "..." : String(awaitingAction),
      icon: Clock,
      note: ordersLoading ? undefined : "to process or ship",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <SellerSidebar active="Dashboard" />

          {/* Main */}
          <main className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground font-display">Seller Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back,{" "}
                  <span className="font-medium text-foreground">
                    {isLoading ? "..." : (seller?.storeName ?? "your store")}
                  </span>
                </p>
              </div>
              <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/seller/products/new">
                  <Plus className="w-4 h-4" /> Add Product
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(({ label, value, icon: Icon, change, note }) => (
                <Card key={label} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      {change && (
                        <span className="text-xs font-medium text-success flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" /> {change}
                        </span>
                      )}
                      {note && <span className="text-xs text-muted-foreground">{note}</span>}
                    </div>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent orders */}
            <Card className="shadow-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
                <Link to="/seller/orders" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">Loading orders...</p>
                ) : ordersError ? (
                  <p className="py-6 text-center text-sm text-destructive">
                    Could not load orders. Please refresh.
                  </p>
                ) : recent.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No orders yet. New orders will show up here.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="text-left py-2 font-medium">Order</th>
                          <th className="text-left py-2 font-medium">Customer</th>
                          <th className="text-left py-2 font-medium">Amount</th>
                          <th className="text-left py-2 font-medium">Date</th>
                          <th className="text-left py-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map(({ order, sub }) => (
                          <tr key={order.id} className="border-b border-border last:border-0">
                            <td className="py-3 font-medium text-foreground">
                              <Link to="/seller/orders" className="hover:underline">
                                {order.orderNumber}
                              </Link>
                            </td>
                            <td className="py-3 text-muted-foreground">
                              {order.shippingAddress?.fullName ?? "—"}
                            </td>
                            <td className="py-3 text-foreground">{formatPrice(sub.subTotal)}</td>
                            <td className="py-3 text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[sub.status] ?? ""}`}
                              >
                                {sub.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerDashboard;