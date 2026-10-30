import { LayoutDashboard, Users, Package, ShoppingCart, BarChart3, LogOut, Image as ImageIcon, UserRound, FolderTree, MessageSquare, Ticket, Wallet, Truck, Bell, Settings, ShieldCheck, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// import { adminLogout } from "@/lib/admin-store";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/admin/NotificationBell";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin/dashboard" },
  { icon: Users, label: "Sellers", href: "/admin/sellers" },
  { icon: UserRound, label: "Customers", href: "/admin/customers" },
  { icon: FolderTree, label: "Categories", href: "/admin/categories" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Truck, label: "Shipping", href: "/admin/shipping" },
  { icon: MessageSquare, label: "Reviews", href: "/admin/reviews" },
  { icon: Ticket, label: "Coupons", href: "/admin/coupons" },
  { icon: Wallet, label: "Payments", href: "/admin/payments" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: ImageIcon, label: "Banners", href: "/admin/banners" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: FileText, label: "Content Pages", href: "/admin/pages" },
  { icon: ShieldCheck, label: "Staff & Roles", href: "/admin/staff" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

interface AdminSidebarProps {
  active: string;
}

const AdminSidebar = ({ active }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
const handleLogout = () => {
  logout();
  toast.success("Logged out");
  navigate("/admin/login");
};

  return (
    <aside className="md:w-56 shrink-0">
      <nav className="space-y-1 bg-card rounded-lg shadow-card p-3">
        <div className="flex items-center justify-between px-3 pb-2 mb-1 border-b border-border">
        <span className="text-sm font-semibold text-foreground">Admin Panel</span>
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
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors mt-2 border-t border-border pt-3"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
