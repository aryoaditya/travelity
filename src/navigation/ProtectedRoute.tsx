import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";
import type { ReactNode } from "react";

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = isAuthenticated();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
