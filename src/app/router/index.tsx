import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "@/pages/LoginPage";
import ApplicationsPage from "@/pages/ApplicationsPage";
import NewApplicationPage from "@/pages/NewApplicationPage";
import ApplicationDetailsPage from "@/pages/ApplicationDetailsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
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
]);