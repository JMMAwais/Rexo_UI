import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from "lucide-react";

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as { reason?: string; method?: string };
  const reason = state.reason || "Your payment could not be processed. Please try again or use a different payment method.";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl shadow-card p-8 text-center border border-destructive/20">
            <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <XCircle className="w-12 h-12 text-destructive" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-foreground font-display mb-2">Payment Failed</h1>
            <p className="text-muted-foreground mb-6">{reason}</p>

            <div className="text-left bg-secondary/50 rounded-lg p-5 mb-6">
              <p className="text-sm font-semibold text-foreground mb-2">Common reasons:</p>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>Insufficient funds in your account</li>
                <li>Incorrect card details or expired card</li>
                <li>Bank declined the transaction</li>
                <li>Network or connection issue during payment</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate("/checkout")}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/cart">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cart
                </Link>
              </Button>
            </div>

            <Link
              to="/help"
              className="inline-flex items-center gap-1.5 mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Need help? Contact Support
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentFailed;
