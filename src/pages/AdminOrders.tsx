import { useMemo, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Eye,
  Ban,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Package,
  User,
  Store,
  MapPin,
  CreditCard,
  Receipt,
  Mail,
} from "lucide-react";
import { products as seedProducts } from "@/lib/mock-data";
import { toast } from "sonner";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  qty: number;
}

interface Order {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  sellerName: string;
  sellerStore: string;
  shippingAddress: string;
  city: string;
  items: OrderItem[];
  payment: "Stripe" | "PayFast" | "COD";
  status: OrderStatus;
  date: string;
}

const buyers = [
  { name: "Ali Raza", email: "ali.raza@mail.com", phone: "+92 300 1234567", city: "Karachi" },
  { name: "Sana Khan", email: "sana.k@mail.com", phone: "+92 301 2345678", city: "Lahore" },
  { name: "Hamza Iqbal", email: "hamza@mail.com", phone: "+92 333 3456789", city: "Islamabad" },
  { name: "Ayesha Noor", email: "ayesha.n@mail.com", phone: "+92 345 4567890", city: "Rawalpindi" },
  { name: "Bilal Ahmed", email: "bilal@mail.com", phone: "+92 321 5678901", city: "Faisalabad" },
];

const streets = ["House 12, Street 5, Block B", "Flat 3-A, Tariq Plaza", "House 45, F-10 Markaz", "Apt 7, Clifton Block 4"];

const seedOrders: Order[] = seedProducts.slice(0, 8).map((p, i) => {
  const statuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const payments: Order["payment"][] = ["Stripe", "PayFast", "COD"];
  const b = buyers[i % buyers.length];

  // Build 1–3 items per order so the price breakdown has something to show
  const itemCount = (i % 3) + 1;
  const items: OrderItem[] = [];
  let subtotal = 0;
  let totalQty = 0;
  for (let k = 0; k < itemCount; k++) {
    const prod = seedProducts[(i + k + 1) % seedProducts.length];
    const qty = (k === 0 ? (i % 3) + 1 : 1);
    items.push({
      productId: prod.id,
      productName: prod.name,
      productImage: prod.image,
      unitPrice: prod.price,
      qty,
    });
    subtotal += prod.price * qty;
    totalQty += qty;
  }

  return {
    id: `ORD-${10234 + i}`,
    buyerName: b.name,
    buyerEmail: b.email,
    buyerPhone: b.phone,
    sellerName: p.seller.name,
    sellerStore: `${p.seller.name}'s Store`,
    shippingAddress: streets[i % streets.length],
    city: b.city,
    items,
    payment: payments[i % payments.length],
    status: statuses[i % statuses.length],
    date: new Date(Date.now() - i * 86400000 * 2).toISOString().slice(0, 10),
  };
});

const statusStyle: Record<OrderStatus, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  processing: "bg-primary/15 text-primary border-primary/30",
  shipped: "bg-accent/15 text-accent-foreground border-accent/30",
  delivered: "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

const TAX_RATE = 0.05;
const FLAT_SHIPPING = 200;

const computeTotals = (items: OrderItem[]) => {
  const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
  const shipping = items.length > 0 ? FLAT_SHIPPING : 0;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;
  const qty = items.reduce((sum, it) => sum + it.qty, 0);
  return { subtotal, shipping, tax, total, qty };
};

const formatPKR = (n: number) => `Rs ${n.toLocaleString()}`;

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<string>("all");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const cancelOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" as OrderStatus } : o)));
    if (viewOrder?.id === id) setViewOrder((prev) => (prev ? { ...prev, status: "cancelled" } : prev));
    toast.success("Order cancelled");
  };

  const filtered = orders
    .filter((o) => (tab === "all" ? true : o.status === tab))
    .filter((o) =>
      [o.id, o.buyerName, o.buyerEmail, o.sellerName, o.city, ...o.items.map((it) => it.productName)]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
    );

  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + computeTotals(o.items).total, 0);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingCart },
    { label: "Pending", value: count("pending"), icon: Clock },
    { label: "Shipped", value: count("shipped"), icon: Truck },
    { label: "Revenue", value: formatPKR(revenue), icon: CheckCircle2 },
  ];

  const viewTotals = useMemo(
    () => (viewOrder ? computeTotals(viewOrder.items) : null),
    [viewOrder],
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground font-display">Orders Oversight</h1>
          <p className="text-sm text-muted-foreground">
            Track every order across all sellers and intervene when needed
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar active="Orders" />

          <main className="flex-1 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((s) => (
                <Card key={s.label} className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <s.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-xl font-bold text-foreground mt-1">{s.value}</p>
                </Card>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, buyer, seller, product..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({count("pending")})</TabsTrigger>
                <TabsTrigger value="processing">Processing ({count("processing")})</TabsTrigger>
                <TabsTrigger value="shipped">Shipped ({count("shipped")})</TabsTrigger>
                <TabsTrigger value="delivered">Delivered ({count("delivered")})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({count("cancelled")})</TabsTrigger>
              </TabsList>

              <TabsContent value={tab} className="mt-4">
                <Card className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
                            No orders found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filtered.map((o) => {
                          const t = computeTotals(o.items);
                          return (
                            <TableRow
                              key={o.id}
                              className="cursor-pointer hover:bg-muted/40"
                              onClick={() => setViewOrder(o)}
                            >
                              <TableCell className="font-mono text-xs">{o.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center -space-x-2">
                                  {o.items.slice(0, 3).map((it, idx) => (
                                    <img
                                      key={idx}
                                      src={it.productImage}
                                      alt={it.productName}
                                      className="w-9 h-9 rounded-md object-cover ring-2 ring-card"
                                      loading="lazy"
                                    />
                                  ))}
                                  {o.items.length > 3 && (
                                    <span className="w-9 h-9 rounded-md bg-muted text-[10px] font-semibold flex items-center justify-center ring-2 ring-card">
                                      +{o.items.length - 3}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {o.items.length} {o.items.length === 1 ? "item" : "items"}
                                </p>
                              </TableCell>
                              <TableCell className="text-sm">
                                <p className="font-medium">{o.buyerName}</p>
                                <p className="text-xs text-muted-foreground">{o.city}</p>
                              </TableCell>
                              <TableCell className="text-sm">{o.sellerName}</TableCell>
                              <TableCell className="text-sm">{t.qty}</TableCell>
                              <TableCell className="text-sm font-semibold">
                                {formatPKR(t.total)}
                              </TableCell>
                              <TableCell className="text-sm">{o.payment}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{o.date}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={`capitalize ${statusStyle[o.status]}`}>
                                  {o.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setViewOrder(o)}
                                    title="View order details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => cancelOrder(o.id)}
                                    disabled={o.status === "cancelled" || o.status === "delivered"}
                                    title="Cancel order"
                                  >
                                    {o.status === "cancelled" ? (
                                      <XCircle className="w-4 h-4" />
                                    ) : (
                                      <Ban className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Order detail modal */}
      <Dialog open={!!viewOrder} onOpenChange={(open) => !open && setViewOrder(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          {viewOrder && viewTotals && (
            <div className="flex flex-col max-h-[85vh]">
              <DialogHeader className="px-6 pt-6 pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="text-xl">
                      Order {viewOrder.id}
                    </DialogTitle>
                    <DialogDescription>
                      Placed on {viewOrder.date} · {viewOrder.items.length}{" "}
                      {viewOrder.items.length === 1 ? "item" : "items"} · {viewTotals.qty} units
                    </DialogDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={`capitalize text-xs ${statusStyle[viewOrder.status]}`}
                  >
                    {viewOrder.status}
                  </Badge>
                </div>
              </DialogHeader>

              <ScrollArea className="px-6 flex-1">
                {/* People */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                  <Card className="p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
                      <User className="w-3.5 h-3.5" /> Buyer
                    </div>
                    <p className="font-medium text-sm">{viewOrder.buyerName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" /> {viewOrder.buyerEmail}
                    </p>
                    <p className="text-xs text-muted-foreground">{viewOrder.buyerPhone}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {viewOrder.shippingAddress}, {viewOrder.city}
                    </p>
                  </Card>
                  <Card className="p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
                      <Store className="w-3.5 h-3.5" /> Seller
                    </div>
                    <p className="font-medium text-sm">{viewOrder.sellerStore}</p>
                    <p className="text-xs text-muted-foreground">Owned by {viewOrder.sellerName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <CreditCard className="w-3 h-3" /> Paid via {viewOrder.payment}
                    </p>
                  </Card>
                </div>

                {/* Items */}
                <div className="pb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
                    <Package className="w-3.5 h-3.5" /> Order items
                  </div>
                  <div className="space-y-2">
                    {viewOrder.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 rounded-md bg-muted/40"
                      >
                        <img
                          src={it.productImage}
                          alt={it.productName}
                          className="w-12 h-12 rounded-md object-cover"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{it.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatPKR(it.unitPrice)} × {it.qty}
                          </p>
                        </div>
                        <p className="text-sm font-semibold whitespace-nowrap">
                          {formatPKR(it.unitPrice * it.qty)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Price breakdown */}
                <div className="pb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
                    <Receipt className="w-3.5 h-3.5" /> Price breakdown
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({viewTotals.qty} units)</span>
                      <span>{formatPKR(viewTotals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{formatPKR(viewTotals.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (5%)</span>
                      <span>{formatPKR(viewTotals.tax)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-base font-bold pt-1">
                      <span>Total</span>
                      <span>{formatPKR(viewTotals.total)}</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="px-6 py-4 border-t bg-muted/30">
                <Button variant="outline" onClick={() => setViewOrder(null)}>
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => cancelOrder(viewOrder.id)}
                  disabled={viewOrder.status === "cancelled" || viewOrder.status === "delivered"}
                >
                  <Ban className="w-4 h-4 mr-2" /> Cancel order
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
