import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Store, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { graphqlRequest, GraphQLRequestError } from "@/lib/graphqlClient";

const benefits = [
  "Access to millions of buyers across Pakistan",
  "Integrated payment processing (Stripe, PayFast, COD)",
  "Dropshipping support built-in",
  "Dedicated seller dashboard & analytics",
  "Buyer protection builds trust",
];

const REGISTER_SELLER_MUTATION = `
  mutation RegisterSeller($input: RegisterSellerInput!) {
    registerSeller(input: $input) {
      data { id status }
      error
    }
  }
`;

const SellerRegister = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [contactEmail, setContactEmail] = useState(user?.email ?? "");
  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await graphqlRequest<{
        registerSeller: { data: { id: string; status: string } | null; error: string | null };
      }>(REGISTER_SELLER_MUTATION, {
        input: {
          userId: "00000000-0000-0000-0000-000000000000", // backend current logged-in user se khud nikal leta hai
          storeName,
          storeDescription,
          contactEmail,
          contactPhone,
        },
      });

      if (result.registerSeller.error || !result.registerSeller.data) {
        throw new GraphQLRequestError(result.registerSeller.error ?? "Registration failed");
      }

      setSubmitted(true);
    } catch (err) {
      toast.error("Registration fail ho gayi", {
        description: err instanceof Error ? err.message : "Dobara koshish karein",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Session abhi load ho rahi hai ────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }


  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 max-w-md text-center">
          <Store className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">To become a Seller you need to  login first</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Before registering as a seller, please log in to your account. If you don't have an account yet, you can create one easily.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate("/login")}>Login</Button>
            <Button variant="outline" onClick={() => navigate("/register")}>
              Create Account 
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (user.role === "Seller") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 max-w-md text-center">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">You are already a Seller</h1>
          <Button onClick={() => navigate("/seller/dashboard")} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
        <Footer />
      </div>
    );
  }


  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 max-w-md text-center">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Application submitted!</h1>
          <p className="text-sm text-muted-foreground">
            Your store "{storeName}" has been submitted for review. You will receive an email once it's approved.
          </p>
          <Button onClick={() => navigate("/")} className="mt-6">
            Go to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }


  return (
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Store Name *</Label>
                <Input
                  placeholder="My Awesome Store"
                  className="bg-secondary border-0"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Email *</Label>
                <Input
                  type="email"
                  placeholder="seller@example.com"
                  className="bg-secondary border-0"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone *</Label>
                <Input
                  type="tel"
                  placeholder="+92 300 1234567"
                  className="bg-secondary border-0"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Store Description *</Label>
                <Textarea
                  placeholder="Tell buyers about your store..."
                  className="bg-secondary border-0 min-h-[80px]"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Create Seller Account"
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By registering, you agree to our Seller Terms & Conditions
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerRegister;