import { LayoutDashboard, Package, ShoppingCart, BarChart3, Star, Wallet, Bell, Settings, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import NotificationBell from "@/components/admin/NotificationBell";


const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/seller/dashboard" },
  { icon: Package, label: "Products", href: "/seller/products" },
  { icon: Truck, label: "Dropshipping", href: "/seller/dropshipping" },
  { icon: ShoppingCart, label: "Orders", href: "/seller/orders" },
  { icon: BarChart3, label: "Analytics", href: "/seller/analytics" },
  { icon: Star, label: "Reviews", href: "/seller/reviews" },
  { icon: Wallet, label: "Earnings", href: "/seller/earnings" },
  { icon: Bell, label: "Notifications", href: "/seller/notifications" },
  { icon: Settings, label: "Settings", href: "/seller/settings" },
];

interface SellerSidebarProps {
  active: string;
}

const SellerSidebar = ({ active }: SellerSidebarProps) => (
  <aside className="md:w-56 shrink-0">
   
       <nav className="space-y-1 bg-card rounded-lg shadow-card p-3">
      <div className="flex items-center justify-between px-3 pb-2 mb-1 border-b border-border">
        <span className="text-sm font-semibold text-foreground">Seller Panel</span>
        <NotificationBell />
      </div>
      {navItems.map(({ icon: Icon, label, href }) => (
        <Link
          key={label}
          to={href}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
            active === label
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      ))}
    </nav>
  </aside>
);

export default SellerSidebar;
