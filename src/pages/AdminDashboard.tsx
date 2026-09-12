import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Users, Package, ShoppingCart, DollarSign, Clock, TrendingUp } from "lucide-react";
import { getSellers } from "@/lib/admin-store";
import { products } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const sellers = getSellers();
  const pending = sellers.filter((s) => s.status === "pending").length;
  const approved = sellers.filter((s) => s.status === "approved").length;

  const stats = [
    { label: "Pending Sellers", value: pending, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    { label: "Active Sellers", value: approved, icon: Users, color: "text-success", bg: "bg-success/10" },
    { label: "Total Products", value: products.length, icon: Package, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Orders", value: 1248, icon: ShoppingCart, color: "text-accent-foreground", bg: "bg-accent/30" },
    { label: "Revenue (Rs.)", value: "1.2M", icon: DollarSign, color: "text-success", bg: "bg-success/10" },
    { label: "Growth", value: "+24%", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-display">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Marketplace overview at a glance</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Overview" />

          <main className="flex-1 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map(({ label, value, icon: Icon, color, bg }) => (
                <Card key={label} className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {pending > 0 && (
              <Card className="p-5 border-warning/30 bg-warning/5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/15 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {pending} seller{pending > 1 ? "s" : ""} awaiting approval
                      </p>
                      <p className="text-sm text-muted-foreground">Review and approve to grow your marketplace</p>
                    </div>
                  </div>
                  <Link to="/admin/sellers">
                    <Button>Review Now</Button>
                  </Link>
                </div>
              </Card>
            )}

            <Card className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Link to="/admin/sellers" className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors">
                  <Users className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm font-medium">Manage Sellers</p>
                </Link>
                <Link to="/admin/banners" className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors">
                  <Package className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm font-medium">Edit Banners</p>
                </Link>
                <Link to="/admin/analytics" className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors">
                  <TrendingUp className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm font-medium">View Analytics</p>
                </Link>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
