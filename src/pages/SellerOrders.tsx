import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye } from "lucide-react";
import { formatPrice } from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const orders = [
  { id: "#ORD-001", customer: "Ahmed Khan", email: "ahmed@email.com", items: 2, amount: 7999, date: "2026-03-28", status: "Processing" },
  { id: "#ORD-002", customer: "Sara Ali", email: "sara@email.com", items: 1, amount: 3499, date: "2026-03-27", status: "Shipped" },
  { id: "#ORD-003", customer: "Usman Malik", email: "usman@email.com", items: 3, amount: 14999, date: "2026-03-26", status: "Delivered" },
  { id: "#ORD-004", customer: "Ayesha Noor", email: "ayesha@email.com", items: 1, amount: 2199, date: "2026-03-25", status: "Pending" },
  { id: "#ORD-005", customer: "Bilal Shah", email: "bilal@email.com", items: 4, amount: 22500, date: "2026-03-24", status: "Delivered" },
  { id: "#ORD-006", customer: "Fatima Zahra", email: "fatima@email.com", items: 2, amount: 5600, date: "2026-03-23", status: "Cancelled" },
  { id: "#ORD-007", customer: "Hassan Raza", email: "hassan@email.com", items: 1, amount: 8999, date: "2026-03-22", status: "Processing" },
];

const statusStyles: Record<string, string> = {
  Processing: "bg-primary/10 text-primary border-primary/20",
  Shipped: "bg-accent/10 text-accent border-accent/20",
  Delivered: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const SellerOrders = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <SellerSidebar active="Orders" />
        <main className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-display">Orders</h1>
            <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="shadow-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-3 px-4 font-medium">Order ID</th>
                      <th className="text-left py-3 px-4 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 font-medium">Items</th>
                      <th className="text-left py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">{order.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-foreground">{order.customer}</p>
                            <p className="text-xs text-muted-foreground">{order.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-foreground">{order.items}</td>
                        <td className="py-3 px-4 text-foreground font-medium">{formatPrice(order.amount)}</td>
                        <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={statusStyles[order.status]}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
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

export default SellerOrders;
