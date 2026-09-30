import { createBrowserRouter, Navigate } from "react-router";
import AppLayout from "@/app/layout/AppLayout";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import ApplicationDetailsPage from "@/features/applications/pages/ApplicationDetailsPage";
import ApplicationsPage from "@/features/applications/pages/ApplicationsPage";
import EditApplicationPage from "@/features/applications/pages/EditApplicationPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import NewApplicationPage from "@/features/applications/pages/NewApplicationPage";

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
        element: <AppLayout />,
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
            path: "/applications/:id/edit",
            element: <EditApplicationPage />,
          },
          {
            path: "/applications/:id",
            element: <ApplicationDetailsPage />,
          },
        ],
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