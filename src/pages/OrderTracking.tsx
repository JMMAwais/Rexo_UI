import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/mock-data";

const mockOrder = {
  id: "ORD-2026-001",
  date: "March 28, 2026",
  status: "shipped",
  total: 13697,
  items: [
    { name: "Wireless Noise Cancelling Headphones", qty: 1, price: 7999, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" },
    { name: "Vintage Denim Jacket", qty: 1, price: 5999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop" },
  ],
  timeline: [
    { status: "Order Placed", date: "Mar 28, 2026 - 10:30 AM", completed: true, icon: Clock },
    { status: "Processing", date: "Mar 28, 2026 - 11:00 AM", completed: true, icon: Package },
    { status: "Shipped", date: "Mar 29, 2026 - 2:15 PM", completed: true, icon: Truck },
    { status: "Out for Delivery", date: "Estimated Mar 31", completed: false, icon: MapPin },
    { status: "Delivered", date: "", completed: false, icon: CheckCircle },
  ],
};

const OrderTracking = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-foreground mb-2 font-display">Track Order</h1>
      <p className="text-sm text-muted-foreground mb-8">Order {mockOrder.id} • Placed on {mockOrder.date}</p>

      {/* Timeline */}
      <Card className="shadow-card mb-8">
        <CardContent className="p-6">
          <div className="space-y-0">
            {mockOrder.timeline.map((step, i) => (
              <div key={step.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  {i < mockOrder.timeline.length - 1 && (
                    <div className={`w-0.5 h-12 ${step.completed ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
                <div className="pb-8">
                  <p className={`text-sm font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.status}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.date || "Pending"}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order items */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Order Items</h3>
          <div className="space-y-4">
            {mockOrder.items.map((item) => (
              <div key={item.name} className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                </div>
                <p className="text-sm font-medium text-foreground">{formatPrice(item.price)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-border font-bold text-foreground">
            <span>Total</span>
            <span>{formatPrice(mockOrder.total)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
    <Footer />
  </div>
);

export default OrderTracking;
