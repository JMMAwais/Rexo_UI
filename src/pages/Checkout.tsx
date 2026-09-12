import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/mock-data";
import { CreditCard, Banknote, Wallet, Shield, Building2, Smartphone, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const paymentMethods = [
  { id: "safepay", name: "SafePay", desc: "Card, Wallet & Bank — secure checkout", icon: Shield, badge: "Recommended" },
  { id: "stripe", name: "Credit / Debit Card", desc: "Powered by Stripe", icon: CreditCard },
  { id: "payfast", name: "PayFast", desc: "Instant EFT & Mobile", icon: Wallet },
  { id: "cod", name: "Cash on Delivery", desc: "Pay when you receive", icon: Banknote },
];

const safepayMethods = [
  { id: "card", name: "Debit / Credit Card", desc: "Visa, MasterCard, UnionPay", icon: CreditCard },
  { id: "wallet", name: "Mobile Wallet", desc: "JazzCash, Easypaisa, SadaPay", icon: Smartphone },
  { id: "bank", name: "Bank Transfer", desc: "Direct bank account payment", icon: Building2 },
];

const wallets = ["JazzCash", "Easypaisa", "SadaPay"];

const Checkout = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("safepay");
  const [safepayMethod, setSafepayMethod] = useState("card");
  const [selectedWallet, setSelectedWallet] = useState("JazzCash");
  const [processing, setProcessing] = useState(false);

  const handlePlaceOrder = () => {
    if (selectedPayment === "safepay") {
      setProcessing(true);
      toast.loading("Processing payment via SafePay...", { id: "sp" });
      setTimeout(() => {
        toast.dismiss("sp");
        setProcessing(false);
        navigate("/payment/success", {
          state: {
            method: "SafePay",
            subMethod: safepayMethods.find((m) => m.id === safepayMethod)?.name,
            amount: 13697,
            orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
          },
        });
      }, 1800);
      return;
    }
    navigate("/payment/success", {
      state: { method: selectedPayment, amount: 13697, orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000) },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8 font-display">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="bg-card rounded-lg shadow-card p-6">
              <h2 className="font-semibold text-foreground mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm">First Name</Label>
                  <Input id="firstName" placeholder="John" className="bg-secondary border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" className="bg-secondary border-0" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address" className="text-sm">Address</Label>
                  <Input id="address" placeholder="123 Main Street" className="bg-secondary border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm">City</Label>
                  <Input id="city" placeholder="Lahore" className="bg-secondary border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">Phone</Label>
                  <Input id="phone" placeholder="+92 300 1234567" className="bg-secondary border-0" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card rounded-lg shadow-card p-6">
              <h2 className="font-semibold text-foreground mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map((pm) => {
                  const active = selectedPayment === pm.id;
                  return (
                    <div key={pm.id}>
                      <button
                        onClick={() => setSelectedPayment(pm.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                          active ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <pm.icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{pm.name}</p>
                            {pm.badge && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                                {pm.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{pm.desc}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            active ? "border-primary" : "border-muted-foreground/40"
                          }`}
                        >
                          {active && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                      </button>

                      {/* SafePay custom (inline) fields */}
                      {pm.id === "safepay" && active && (
                        <div className="mt-3 ml-2 pl-4 border-l-2 border-primary/30 space-y-3">
                          <p className="text-xs text-muted-foreground">Choose how you want to pay via SafePay:</p>
                          {safepayMethods.map((sm) => {
                            const sActive = safepayMethod === sm.id;
                            return (
                              <button
                                key={sm.id}
                                onClick={() => setSafepayMethod(sm.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-md border transition-all text-left ${
                                  sActive ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                                }`}
                              >
                                <sm.icon className={`w-4 h-4 ${sActive ? "text-primary" : "text-muted-foreground"}`} />
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-foreground">{sm.name}</p>
                                  <p className="text-[11px] text-muted-foreground">{sm.desc}</p>
                                </div>
                                <div
                                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                                    sActive ? "border-primary" : "border-muted-foreground/40"
                                  }`}
                                >
                                  {sActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </div>
                              </button>
                            );
                          })}

                          {/* Inline detail form */}
                          <div className="rounded-lg border border-border bg-secondary/30 p-4">
                            {safepayMethod === "card" && (
                              <div className="space-y-3">
                                <p className="text-sm font-medium text-foreground">Card Details</p>
                                <div className="space-y-1.5">
                                  <Label htmlFor="cardNumber" className="text-xs">Card Number</Label>
                                  <div className="relative">
                                    <Input id="cardNumber" inputMode="numeric" placeholder="1234 5678 9012 3456" maxLength={19} className="pl-9 bg-background" />
                                    <CreditCard className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label htmlFor="cardName" className="text-xs">Cardholder Name</Label>
                                  <Input id="cardName" placeholder="Name on card" className="bg-background" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1.5">
                                    <Label htmlFor="expiry" className="text-xs">Expiry Date</Label>
                                    <Input id="expiry" placeholder="MM/YY" maxLength={5} className="bg-background" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label htmlFor="cvv" className="text-xs">CVV</Label>
                                    <Input id="cvv" placeholder="123" maxLength={4} type="password" className="bg-background" />
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                  {["VISA", "MC", "UP"].map((b) => (
                                    <div key={b} className="w-9 h-5 rounded bg-background border border-border flex items-center justify-center text-[9px] font-bold">
                                      {b}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {safepayMethod === "wallet" && (
                              <div className="space-y-3">
                                <p className="text-sm font-medium text-foreground">Mobile Wallet</p>
                                <div className="grid grid-cols-3 gap-2">
                                  {wallets.map((w) => (
                                    <button
                                      key={w}
                                      onClick={() => setSelectedWallet(w)}
                                      className={`p-3 rounded-lg border-2 transition-all text-xs font-medium ${
                                        selectedWallet === w ? "border-primary bg-primary/5 text-foreground" : "border-border hover:border-primary/50"
                                      }`}
                                    >
                                      {w}
                                    </button>
                                  ))}
                                </div>
                                <div className="space-y-1.5">
                                  <Label htmlFor="mobile" className="text-xs">Mobile Number</Label>
                                  <div className="relative">
                                    <Input id="mobile" inputMode="numeric" placeholder="03XX XXXXXXX" className="pl-9 bg-background" />
                                    <Smartphone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label htmlFor="pin" className="text-xs">MPIN / OTP</Label>
                                  <Input id="pin" placeholder="Enter your MPIN" type="password" maxLength={6} className="bg-background" />
                                </div>
                              </div>
                            )}

                            {safepayMethod === "bank" && (
                              <div className="space-y-3">
                                <p className="text-sm font-medium text-foreground">Bank Transfer</p>
                                <div className="space-y-1.5">
                                  <Label htmlFor="bank" className="text-xs">Select Bank</Label>
                                  <select id="bank" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                                    <option>HBL — Habib Bank</option>
                                    <option>UBL — United Bank</option>
                                    <option>MCB Bank</option>
                                    <option>Meezan Bank</option>
                                    <option>Bank Alfalah</option>
                                  </select>
                                </div>
                                <div className="space-y-1.5">
                                  <Label htmlFor="account" className="text-xs">Account Number / IBAN</Label>
                                  <div className="relative">
                                    <Input id="account" placeholder="PK00 XXXX 0000 0000 0000 0000" className="pl-9 bg-background" />
                                    <Building2 className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-3">
                              <Lock className="w-3 h-3" />
                              256-bit SSL encrypted · PCI DSS compliant · Powered by SafePay
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-card rounded-lg shadow-card p-6 h-fit sticky top-24">
            <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal (3 items)</span><span>{formatPrice(13697)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Free</span></div>
              <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border text-base">
                <span>Total</span><span>{formatPrice(13697)}</span>
              </div>
            </div>
            <Button
              onClick={handlePlaceOrder}
              disabled={processing}
              className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {processing ? "Processing..." : selectedPayment === "safepay" ? `Pay ${formatPrice(13697)}` : "Place Order"}
            </Button>
            {selectedPayment === "safepay" && (
              <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-muted-foreground">
                <Shield className="w-3 h-3 text-primary" />
                Secured by SafePay
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center mt-3">
              By placing your order, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
