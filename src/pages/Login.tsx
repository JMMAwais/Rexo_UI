import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";


const Login = () => {
 const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");

      const from = (location.state as { from?: Location })?.from?.pathname;

      const saved = JSON.parse(localStorage.getItem("rexo_user") ?? "null");
      const roles: string[] = saved?.roles ?? [];
      const home = roles.includes("Admin")
        ? "/admin/dashboard"
        : roles.includes("Seller")
          ? "/seller/dashboard"
          : "/";

      navigate(from ?? home, { replace: true });
    } catch (err) {
      toast.error("Login failed", {
        description: err instanceof Error ? err.message : "Email or password is incorrect",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

   const redirectAfterLogin = () => {
    const from = (location.state as { from?: Location })?.from?.pathname;
    const saved = JSON.parse(localStorage.getItem("rexo_user") ?? "null");
    const roles: string[] = saved?.roles ?? [];
    const home = roles.includes("Admin")
      ? "/admin/dashboard"
      : roles.includes("Seller")
        ? "/seller/dashboard"
        : "/";
    navigate(from ?? home, { replace: true });
  };

    const handleGoogleSuccess = async (idToken?: string) => {
    if (!idToken) {
      toast.error("Google login failed", { description: "Google se token nahi mila" });
      return;
    }
    setIsSubmitting(true);
    try {
      await googleLogin(idToken);
      toast.success("Welcome back!");
      redirectAfterLogin();
    } catch (err) {
      toast.error("Google login failed", {
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
          <h1 className="text-2xl font-bold text-foreground text-center font-display mb-6">Sign In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(res) => handleGoogleSuccess(res.credential)}
                onError={() => toast.error("Google login failed")}
                text="signin_with"
                shape="rectangular"
                width="336"
              />
            </div>
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-border" />
              <span className="mx-3 text-xs text-muted-foreground uppercase">or</span>
              <div className="flex-grow border-t border-border" />
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
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-secondary border-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;