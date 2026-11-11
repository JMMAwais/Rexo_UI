import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, ShoppingCart, Package, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { useNotifications } from "@/context/NotificationsContext";
import type { AppNotification } from "@/lib/notificationsApi";

const iconMap: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  NewOrder: { icon: ShoppingCart, color: "text-primary", bg: "bg-primary/10" },
};
const defaultIcon = { icon: Package, color: "text-muted-foreground", bg: "bg-secondary" };

// Backend UTC time bhejta hai; agar timezone suffix na ho to 'Z' laga do
const parseUtc = (iso: string) =>
  new Date(/[zZ]|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : `${iso}Z`);

const timeAgo = (iso: string) => {
  const seconds = Math.max(0, Math.floor((Date.now() - parseUtc(iso).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return parseUtc(iso).toLocaleDateString();
};

const SellerNotifications = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, isLive, markAsRead, markAllAsRead } = useNotifications();
  const [tab, setTab] = useState("all");

  const filtered = notifications.filter((n) => {
    if (tab === "all") return true;
    if (tab === "unread") return !n.isRead;
    if (tab === "orders") return n.type === "NewOrder";
    return true;
  });

  const open = (n: AppNotification) => {
    void markAsRead(n.id);
    if (n.type === "NewOrder") navigate("/seller/orders");
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    toast.success("All notifications marked as read");
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
                <p className="text-sm text-muted-foreground mt-1">
                  Stay updated with new orders and store activity ·{" "}
                  <span className={isLive ? "text-success" : ""}>
                    {isLive ? "Live" : "Updates every minute"}
                  </span>
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleMarkAll} disabled={unreadCount === 0}>
                <CheckCheck className="w-4 h-4 mr-1.5" /> Mark all read
              </Button>
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
                    <TabsTrigger value="orders">Orders</TabsTrigger>
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
                          const cfg = iconMap[n.type] ?? defaultIcon;
                          const Icon = cfg.icon;
                          return (
                            <div
                              key={n.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => open(n)}
                              onKeyDown={(e) => e.key === "Enter" && open(n)}
                              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-secondary/50 ${
                                n.isRead ? "border-border bg-card" : "border-primary/20 bg-primary/5"
                              }`}
                            >
                              <div
                                className={`w-9 h-9 rounded-lg ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                      {n.title}
                                      {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                                  </div>
                                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {timeAgo(n.createdAt)}
                                  </span>
                                </div>
                                {!n.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs mt-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      void markAsRead(n.id);
                                    }}
                                  >
                                    Mark as read
                                  </Button>
                                )}
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
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerNotifications;