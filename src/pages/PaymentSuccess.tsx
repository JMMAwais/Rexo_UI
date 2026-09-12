import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ShoppingBag, FileText, Shield } from "lucide-react";
import { formatPrice } from "@/lib/mock-data";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as {
    method?: string;
    subMethod?: string;
    amount?: number;
    orderId?: string;
  };

  const orderId = state.orderId || "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const amount = state.amount ?? 13697;
  const method = state.method || "SafePay";
  const subMethod = state.subMethod;
  const txnId = "SP-" + Date.now().toString().slice(-10);

  useEffect(() => {
    // scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Hero */}
          <div className="bg-card rounded-2xl shadow-card p-8 text-center border border-success/20">
            <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4 animate-in zoom-in duration-500">
              <CheckCircle2 className="w-12 h-12 text-success" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-foreground font-display mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been confirmed and is being processed.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">
                Payment secured by {method}
              </span>
            </div>

            {/* Details */}
            <div className="text-left bg-secondary/50 rounded-lg p-5 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-semibold text-foreground">{orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-foreground">{txnId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="text-foreground">
                  {method}
                  {subMethod && <span className="text-muted-foreground"> · {subMethod}</span>}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground">{new Date().toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-semibold text-foreground">Amount Paid</span>
                <span className="font-bold text-foreground text-lg">{formatPrice(amount)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/products">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/order-tracking">
                  <Package className="w-4 h-4 mr-2" />
                  Track Order
                </Link>
              </Button>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Download Receipt
            </button>
          </div>

          {/* What's next */}
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {[
              { title: "Order Confirmed", desc: "Email sent to your inbox" },
              { title: "Packing Soon", desc: "Seller will ship in 1-2 days" },
              { title: "Delivery", desc: "3-5 business days" },
            ].map((s, i) => (
              <div key={s.title} className="bg-card rounded-lg p-4 shadow-card">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                </div>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
