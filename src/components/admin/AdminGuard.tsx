import { Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "@/lib/admin-store";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  if (!isAdminLoggedIn()) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export default AdminGuard;
