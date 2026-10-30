import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  // Saved session restore hone tak intezar (warna refresh par login par bhej dete)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user?.roles?.includes("Admin")) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export default AdminGuard;