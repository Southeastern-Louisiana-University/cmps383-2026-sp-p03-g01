import { Navigate } from "react-router";
import { useAuth } from "@/context/UserLoggedInContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  requireAuth = true
}: ProtectedRouteProps) {
  const { user, isLoggedIn, isLoading } = useAuth();

  // Show loading while checking auth status
  if (isLoading) {
    return <div className="card"><p>Loading...</p></div>;
  }

  // Check if authentication is required and user is not logged in
  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check if specific roles are required
  if (requiredRoles.length > 0 && (!user || !requiredRoles.some(role => user.roles.includes(role)))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}