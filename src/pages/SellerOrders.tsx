import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, MapPin, Phone } from "lucide-react";
import { formatPrice } from "@/lib/mock-data";
import {
  SELLER_ORDERS_KEY,
  fetchSellerOrders,
  updateSubOrderStatus,
  type SellerOrder,
  type SubOrderStatus,
} from "@/lib/sellerOrdersApi";

const statusStyles: Record<string, string> = {
  Pending: "bg-warning/10 text-warning border-warning/20",
  Confirmed: "bg-warning/10 text-warning border-warning/20",
  Processing: "bg-primary/10 text-primary border-primary/20",
  Shipped: "bg-accent/10 text-accent border-accent/20",
  Delivered: "bg-success/10 text-success border-success/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

// Seller ka agla qadam: current status -> (button label, new status)
const nextStep = (status: SubOrderStatus): { label: string; next: SubOrderStatus } | null => {
  switch (status) {
    case "Pending":
    case "Confirmed":
      return { label: "Start processing", next: "Processing" };
    case "Processing":
      return { label: "Mark as shipped", next: "Shipped" };
    case "Shipped":
      return { label: "Mark as delivered", next: "Delivered" };
    default:
      return null;
  }
};

const SellerOrders = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: orders = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: SELLER_ORDERS_KEY,
    queryFn: () => fetchSellerOrders(50),
  });

  const statusMutation = useMutation({
    mutationFn: ({ subOrderId, status }: { subOrderId: string; status: SubOrderStatus }) =>
      updateSubOrderStatus(subOrderId, status),
    onSuccess: (_data, vars) => {
      toast.success(`Order marked as ${vars.status}`);
      void queryClient.invalidateQueries({ queryKey: SELLER_ORDERS_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Har order mein is seller ka apna hissa (sub-order)
  const rows = useMemo(
    () =>
      orders
        .filter((o) => o.subOrders.length > 0)
        .map((o) => ({ order: o, sub: o.subOrders[0] })),
    [orders]
  );

  const filtered = rows.filter(({ order, sub }) => {
    if (statusFilter !== "all" && sub.status !== statusFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      order.orderNumber.toLowerCase().includes(q) ||
      (order.shippingAddress?.fullName ?? "").toLowerCase().includes(q)
    );
  });

  const selected: SellerOrder | undefined = orders.find((o) => o.id === selectedId);
  const selectedSub = selected?.subOrders[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <SellerSidebar active="Orders" />
          <main className="flex-1 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground font-display">Orders</h1>
              <p className="text-sm text-muted-foreground">{rows.length} total orders</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order # or customer..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="shadow-card">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-4 space-y-3">
                    {[0, 1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : isError ? (
                  <div className="p-8 text-center space-y-3">
                    <p className="text-sm text-destructive">
                      {(error as Error)?.message ?? "Failed to load orders"}
                    </p>
                    <Button variant="outline" size="sm" onClick={() => void refetch()}>
                      Try again
                    </Button>
                  </div>
                ) : filtered.length === 0 ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    {rows.length === 0
                      ? "No orders yet. New orders will show up here."
                      : "No orders match your filters."}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="text-left py-3 px-4 font-medium">Order</th>
                          <th className="text-left py-3 px-4 font-medium">Customer</th>
                          <th className="text-left py-3 px-4 font-medium">Items</th>
                          <th className="text-left py-3 px-4 font-medium">Amount</th>
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-right py-3 px-4 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(({ order, sub }) => {
                          const step = nextStep(sub.status);
                          return (
                            <tr
                              key={order.id}
                              className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                            >
                              <td className="py-3 px-4 font-medium text-foreground">
                                {order.orderNumber}
                              </td>
                              <td className="py-3 px-4">
                                <p className="text-foreground">
                                  {order.shippingAddress?.fullName ?? "—"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {order.shippingAddress?.phoneNumber ?? ""}
                                </p>
                              </td>
                              <td className="py-3 px-4 text-foreground">
                                {sub.items.reduce((n, i) => n + i.quantity, 0)}
                              </td>
                              <td className="py-3 px-4 text-foreground font-medium">
                                {formatPrice(sub.subTotal)}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className={statusStyles[sub.status]}>
                                  {sub.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                {step && (
                                  <Button
                                    size="sm"
                                    className="mr-2"
                                    disabled={statusMutation.isPending}
                                    onClick={() =>
                                      statusMutation.mutate({ subOrderId: sub.id, status: step.next })
                                    }
                                  >
                                    {step.label}
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setSelectedId(order.id)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
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

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-w-lg">
          {selected && selectedSub && (
            <>
              <DialogHeader>
                <DialogTitle>Order {selected.orderNumber}</DialogTitle>
                <DialogDescription>
                  Placed on {new Date(selected.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={statusStyles[selectedSub.status]}>
                    {selectedSub.status}
                  </Badge>
                  <span className="font-semibold text-foreground">
                    {formatPrice(selectedSub.subTotal)}
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedSub.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          className="w-12 h-12 rounded-md object-cover border border-border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-secondary" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{item.productTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.variantInfo ? `${item.variantInfo} · ` : ""}
                          {formatPrice(item.unitPrice)} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-foreground font-medium">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>

                {selected.shippingAddress && (
                  <div className="rounded-md border border-border p-3 space-y-1">
                    <p className="font-medium text-foreground">{selected.shippingAddress.fullName}</p>
                    <p className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5" />
                      {selected.shippingAddress.phoneNumber}
                    </p>
                    <p className="flex items-start gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>
                        {selected.shippingAddress.addressLine1}
                        {selected.shippingAddress.addressLine2
                          ? `, ${selected.shippingAddress.addressLine2}`
                          : ""}
                        , {selected.shippingAddress.city}, {selected.shippingAddress.state}{" "}
                        {selected.shippingAddress.zipCode}, {selected.shippingAddress.country}
                      </span>
                    </p>
                  </div>
                )}

                {selected.notes && (
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Buyer note: </span>
                    {selected.notes}
                  </p>
                )}

                {(() => {
                  const step = nextStep(selectedSub.status);
                  return step ? (
                    <Button
                      className="w-full"
                      disabled={statusMutation.isPending}
                      onClick={() =>
                        statusMutation.mutate({ subOrderId: selectedSub.id, status: step.next })
                      }
                    >
                      {step.label}
                    </Button>
                  ) : null;
                })()}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerOrders;