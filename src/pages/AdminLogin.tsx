import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { adminLogin, ADMIN_CREDENTIALS } from "@/lib/admin-store";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(email, password)) {
      toast.success("Welcome back, Admin");
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-elevated p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-display">Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage the marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="admin@marketplace.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary border-0"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <div className="mt-6 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Demo credentials:</p>
          <p>Email: {ADMIN_CREDENTIALS.email}</p>
          <p>Password: {ADMIN_CREDENTIALS.password}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
