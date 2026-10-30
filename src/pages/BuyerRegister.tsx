import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";


const BuyerRegister = () => {
const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit hua"); // 👈 debug ke liye, baad mein hata dein

    if (password !== confirmPassword) {
      toast.error("Password match nahi kar raha");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ firstName, lastName, email, password, confirmPassword });
      toast.success("Account ban gaya!", { description: "Khushamdeed, MarketHub mein!" });
      navigate("/");
    } catch (err) {
      console.error("Register error:", err); // 👈 debug ke liye
      toast.error("Account nahi ban saka", {
        description: err instanceof Error ? err.message : "Dobara koshish karein",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

    const handleGoogleSuccess = async (idToken?: string) => {
    if (!idToken) {
      toast.error("Google signup failed", { description: "Google se token nahi mila" });
      return;
    }
    setIsSubmitting(true);
    try {
      await googleLogin(idToken);
      toast.success("Account ban gaya!", { description: "Khushamdeed, MarketHub mein!" });
      navigate("/");
    } catch (err) {
      toast.error("Google signup failed", {
        description: err instanceof Error ? err.message : "Dobara koshish karein",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-full max-w-md bg-card rounded-lg shadow-elevated p-8">
          <h1 className="text-2xl font-bold text-foreground text-center font-display mb-6">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(res) => handleGoogleSuccess(res.credential)}
                onError={() => toast.error("Google signup failed")}
                text="signup_with"
                shape="rectangular"
                width="336"
              />
            </div>
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-border" />
              <span className="mx-3 text-xs text-muted-foreground uppercase">or</span>
              <div className="flex-grow border-t border-border" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  placeholder="John"
                  className="bg-secondary border-0"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  placeholder="Doe"
                  className="bg-secondary border-0"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="bg-secondary border-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-secondary border-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-secondary border-0"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuyerRegister;