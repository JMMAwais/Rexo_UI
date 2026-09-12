import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Bell,
  ShoppingCart,
  Package,
  Star,
  Wallet,
  AlertTriangle,
  MessageSquare,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

type NotifType = "order" | "stock" | "review" | "payout" | "system" | "message";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const initial: Notification[] = [
  { id: 1, type: "order", title: "New order received", desc: "Order #ORD-2847 for Rs. 4,500 from Ahmed Khan", time: "2 min ago", read: false },
  { id: 2, type: "stock", title: "Low stock alert", desc: "Wireless Earbuds Pro has only 3 units left", time: "1 hour ago", read: false },
  { id: 3, type: "review", title: "New 5-star review", desc: "Sara Ali left a review on Smart Watch Ultra", time: "3 hours ago", read: false },
  { id: 4, type: "payout", title: "Payout processed", desc: "Rs. 24,500 has been sent to your bank account", time: "Yesterday", read: true },
  { id: 5, type: "order", title: "Order shipped", desc: "Order #ORD-2841 marked as shipped via TCS", time: "Yesterday", read: true },
  { id: 6, type: "message", title: "Customer message", desc: "Bilal Ahmed asked about product availability", time: "2 days ago", read: true },
  { id: 7, type: "system", title: "Platform update", desc: "New shipping zones feature is now available", time: "3 days ago", read: true },
  { id: 8, type: "stock", title: "Out of stock", desc: "Cotton T-Shirt (Black, M) is out of stock", time: "4 days ago", read: true },
];

const iconMap: Record<NotifType, { icon: typeof Bell; color: string; bg: string; label: string }> = {
  order: { icon: ShoppingCart, color: "text-primary", bg: "bg-primary/10", label: "Order" },
  stock: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Stock" },
  review: { icon: Star, color: "text-warning", bg: "bg-warning/10", label: "Review" },
  payout: { icon: Wallet, color: "text-success", bg: "bg-success/10", label: "Payout" },
  message: { icon: MessageSquare, color: "text-primary", bg: "bg-primary/10", label: "Message" },
  system: { icon: Package, color: "text-muted-foreground", bg: "bg-secondary", label: "System" },
};

const SellerNotifications = () => {
  const [items, setItems] = useState<Notification[]>(initial);
  const [tab, setTab] = useState("all");

  const unreadCount = items.filter((n) => !n.read).length;

  const filtered = items.filter((n) => {
    if (tab === "all") return true;
    if (tab === "unread") return !n.read;
    return n.type === tab;
  });

  const markAllRead = () => {
    setItems((s) => s.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markRead = (id: number) => setItems((s) => s.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const remove = (id: number) => {
    setItems((s) => s.filter((n) => n.id !== id));
    toast.success("Notification removed");
  };

  const clearAll = () => {
    setItems([]);
    toast.success("All notifications cleared");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <SellerSidebar active="Notifications" />
          <main className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-foreground font-display flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="bg-primary text-primary-foreground">{unreadCount} new</Badge>
                  )}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Stay updated with orders, reviews, and store activity</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
                  <CheckCheck className="w-4 h-4 mr-1.5" /> Mark all read
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll} disabled={items.length === 0}>
                  <Trash2 className="w-4 h-4 mr-1.5" /> Clear all
                </Button>
              </div>
            </div>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={tab} onValueChange={setTab}>
                  <TabsList className="mb-4 flex flex-wrap h-auto">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                    <TabsTrigger value="order">Orders</TabsTrigger>
                    <TabsTrigger value="stock">Stock</TabsTrigger>
                    <TabsTrigger value="review">Reviews</TabsTrigger>
                    <TabsTrigger value="payout">Payouts</TabsTrigger>
                    <TabsTrigger value="message">Messages</TabsTrigger>
                  </TabsList>

                  <TabsContent value={tab} className="mt-0">
                    {filtered.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No notifications to show</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filtered.map((n) => {
                          const cfg = iconMap[n.type];
                          const Icon = cfg.icon;
                          return (
                            <div
                              key={n.id}
                              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                                n.read ? "border-border bg-card" : "border-primary/20 bg-primary/5"
                              }`}
                            >
                              <div className={`w-9 h-9 rounded-lg ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                      {n.title}
                                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                                  </div>
                                  <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
                                </div>
                                <div className="flex gap-2 mt-2">
                                  {!n.read && (
                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => markRead(n.id)}>
                                      Mark as read
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:text-destructive" onClick={() => remove(n.id)}>
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage which notifications you receive from{" "}
                  <a href="/seller/settings" className="text-primary hover:underline font-medium">Store Settings</a>.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerNotifications;
