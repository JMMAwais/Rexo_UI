import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const SellerGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Session restore ho rahi hai (localStorage check) — ek second ruk jayen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Login hi nahi hai — login page pe bhej do, aur yaad rakho yahan se aaye the
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Login hai lekin Seller nahi (Buyer/Admin) — home pe bhej do
 if (!user.roles?.includes("Seller")) {
  return <Navigate to="/" replace />;
}
  return <>{children}</>;
};

export default SellerGuard;