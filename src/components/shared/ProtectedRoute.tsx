import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Wraps protected routes. If not authenticated, redirects to /login.
 * No loading gate needed — auth state is read synchronously from
 * localStorage via lazy useState initializers in AuthProvider.
 */
export default function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
