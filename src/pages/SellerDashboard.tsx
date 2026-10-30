import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { Plus, TrendingUp, DollarSign, Eye, ShoppingCart, Package, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useMySeller } from "@/hooks/useMySeller";
import { useMyProducts } from "@/hooks/useMyProducts";
import { formatPrice } from "@/lib/mock-data";

interface StatCard {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Trend (abhi sirf mock cards ke liye) */
  change?: string;
  /** Asli cards ke liye chhota note */
  note?: string;
}

const recentOrders = [
  { id: "#ORD-001", customer: "Ahmed Khan", amount: 7999, status: "Processing" },
  { id: "#ORD-002", customer: "Sara Ali", amount: 3499, status: "Shipped" },
  { id: "#ORD-003", customer: "Usman Malik", amount: 14999, status: "Delivered" },
  { id: "#ORD-004", customer: "Ayesha Noor", amount: 2199, status: "Pending" },
];

const statusColor: Record<string, string> = {
  Processing: "bg-primary/10 text-primary",
  Shipped: "bg-accent/10 text-accent",
  Delivered: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
};

const SellerDashboard = () => {
  const { data: seller, isLoading } = useMySeller();
  const { data: products, isLoading: productsLoading } = useMyProducts();

  const productCount = products?.length ?? 0;
  const publishedCount =
    products?.filter((p) => p.status.toLowerCase() === "published").length ?? 0;

  const stats: StatCard[] = [
    { label: "Total Revenue", value: "Rs. 284,500", icon: DollarSign, change: "+12.5%" },
    { label: "Orders", value: "156", icon: ShoppingCart, change: "+8.2%" },
    {
      label: "Products",
      value: productsLoading ? "..." : String(productCount),
      icon: Package,
      note: productsLoading ? undefined : `${publishedCount} published`,
    },
    { label: "Store Views", value: "2,847", icon: Eye, change: "+22.1%" },
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
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left py-2 font-medium">Order</th>
                        <th className="text-left py-2 font-medium">Customer</th>
                        <th className="text-left py-2 font-medium">Amount</th>
                        <th className="text-left py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border last:border-0">
                          <td className="py-3 font-medium text-foreground">{order.id}</td>
                          <td className="py-3 text-muted-foreground">{order.customer}</td>
                          <td className="py-3 text-foreground">{formatPrice(order.amount)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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