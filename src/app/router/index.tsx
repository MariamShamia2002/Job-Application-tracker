import { createBrowserRouter, Navigate } from "react-router";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import ApplicationDetailsPage from "@/pages/ApplicationDetailsPage";
import ApplicationsPage from "@/pages/ApplicationsPage";
import LoginPage from "@/pages/LoginPage";
import NewApplicationPage from "@/pages/NewApplicationPage";

export const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────────────────
  {
    path: "/login",
    element: <LoginPage />,
  },

  // ── Protected ────────────────────────────────────────────────────────────────
  // ProtectedRoute renders <Outlet /> when authenticated, or redirects to /login.
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/applications",
        element: <ApplicationsPage />,
      },
      {
        path: "/applications/new",
        element: <NewApplicationPage />,
      },
      {
        path: "/applications/:id",
        element: <ApplicationDetailsPage />,
      },
    ],
  },

  // ── Root & catch-all redirects ───────────────────────────────────────────────
  {
    path: "/",
    element: <Navigate to="/applications" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/applications" replace />,
  },
]);