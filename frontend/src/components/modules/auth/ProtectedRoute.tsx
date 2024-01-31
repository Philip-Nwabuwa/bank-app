import { useVerifyAuth } from "@/api/userdetails";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data, isLoading, error } = useVerifyAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data?.user) {
    toast.error("Session expired, please login again");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (data?.user) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;
