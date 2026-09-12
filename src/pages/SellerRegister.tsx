import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Store, CheckCircle } from "lucide-react";

const benefits = [
  "Access to millions of buyers across Pakistan",
  "Integrated payment processing (Stripe, PayFast, COD)",
  "Dropshipping support built-in",
  "Dedicated seller dashboard & analytics",
  "Buyer protection builds trust",
];

const SellerRegister = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Left - Benefits */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-display">Become a Seller</h1>
              <p className="text-sm text-muted-foreground">Start your online business today</p>
            </div>
          </div>
          <div className="space-y-4 mt-8">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Form */}
        <div className="bg-card rounded-lg shadow-elevated p-8">
          <h2 className="font-semibold text-foreground mb-6">Store Registration</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input placeholder="John" className="bg-secondary border-0" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input placeholder="Doe" className="bg-secondary border-0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input placeholder="My Awesome Store" className="bg-secondary border-0" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="seller@example.com" className="bg-secondary border-0" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" placeholder="+92 300 1234567" className="bg-secondary border-0" />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input placeholder="Lahore" className="bg-secondary border-0" />
            </div>
            <div className="space-y-2">
              <Label>Store Description</Label>
              <Textarea placeholder="Tell buyers about your store..." className="bg-secondary border-0 min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" className="bg-secondary border-0" />
            </div>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Create Seller Account
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By registering, you agree to our Seller Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default SellerRegister;
