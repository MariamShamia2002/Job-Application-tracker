import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";

function renderAt(initialPath: string) {
  const router = createMemoryRouter(
    [
      { path: "/login", element: <p>Login page</p> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/applications", element: <p>Applications page</p> },
          { path: "/applications/:id", element: <p>Details page</p> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );

  render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  );

  return router;
}

describe("ProtectedRoute", () => {
  it.each(["/applications", "/applications/123"])(
    "redirects %s to /login when there is no token",
    async (path) => {
      const router = renderAt(path);

      expect(await screen.findByText("Login page")).toBeInTheDocument();
      expect(router.state.location.pathname).toBe("/login");
      expect(screen.queryByText("Applications page")).not.toBeInTheDocument();
      expect(screen.queryByText("Details page")).not.toBeInTheDocument();
    },
  );

  it("replaces the history entry so Back does not return to the protected page", async () => {
    const router = renderAt("/applications");

    await screen.findByText("Login page");
    expect(router.state.historyAction).toBe("REPLACE");
  });

  it("shows the protected page when there is a token", async () => {
    localStorage.setItem("auth_token", "test-token");

    const router = renderAt("/applications");

    expect(await screen.findByText("Applications page")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/applications");
  });
});
