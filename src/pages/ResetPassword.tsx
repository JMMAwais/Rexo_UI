import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { resetPassword } from "@/lib/authApi";

// Backend ki password policy: 8+, uppercase, lowercase, digit, special char
const validatePassword = (p: string): string | null => {
  if (p.length < 8) return "Kam az kam 8 characters hone chahiye";
  if (!/[A-Z]/.test(p)) return "Aik uppercase letter zaroori hai";
  if (!/[a-z]/.test(p)) return "Aik lowercase letter zaroori hai";
  if (!/[0-9]/.test(p)) return "Aik number zaroori hai";
  if (!/[^a-zA-Z0-9]/.test(p)) return "Aik special character zaroori hai";
  return null;
};

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // searchParams.get() khud URL-decode kar deta hai, dobara decode mat karna
  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const linkInvalid = !email || !token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const problem = validatePassword(newPassword);
    if (problem) {
      toast.error(problem);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Dono passwords match nahi karte");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({ email, token, newPassword, confirmPassword });
      toast.success("Password badal diya gaya. Ab login karein.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error("Password reset nahi ho saka", {
        description: err instanceof Error ? err.message : "Link expire ho sakta hai, dobara request karein",
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
          <h1 className="text-2xl font-bold text-foreground text-center font-display mb-6">
            Reset Password
          </h1>

          {linkInvalid ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">Ye reset link adhura ya galat hai.</p>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Naya link mangwayen
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-muted-foreground text-center">{email}</p>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  className="bg-secondary border-0"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  8+ characters, uppercase, lowercase, number aur special character
                </p>
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
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
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Save ho raha hai...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;