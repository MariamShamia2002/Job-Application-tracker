import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { User } from "@/features/auth/types/auth";
import { AuthProvider } from "./AuthProvider";

const testUser: User = {
  id: "1",
  email: "intern@example.com",
  name: "Intern",
  createdAt: "2026-01-01T00:00:00.000Z",
};

// Shows the auth state on screen and exposes setAuth/logout as buttons.
function AuthProbe() {
  const { token, user, setAuth, logout } = useAuth();
  return (
    <>
      <p>token: {token ?? "none"}</p>
      <p>user: {user?.name ?? "none"}</p>
      <button onClick={() => setAuth("new-token", testUser)}>Log in</button>
      <button onClick={logout}>Log out</button>
    </>
  );
}

function renderProvider() {
  return render(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AuthProvider", () => {
  it("starts logged out when localStorage is empty", () => {
    renderProvider();

    expect(screen.getByText("token: none")).toBeInTheDocument();
    expect(screen.getByText("user: none")).toBeInTheDocument();
  });

  it("restores the token and user from localStorage", () => {
    localStorage.setItem("auth_token", "saved-token");
    localStorage.setItem("auth_user", JSON.stringify(testUser));

    renderProvider();

    expect(screen.getByText("token: saved-token")).toBeInTheDocument();
    expect(screen.getByText("user: Intern")).toBeInTheDocument();
  });

  it("clears localStorage when the saved user is broken JSON", () => {
    localStorage.setItem("auth_token", "saved-token");
    localStorage.setItem("auth_user", "{not json");

    renderProvider();

    expect(screen.getByText("user: none")).toBeInTheDocument();
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
  });

  it("setAuth saves the token and user and updates the state", async () => {
    const user = userEvent.setup();
    renderProvider();

    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(screen.getByText("token: new-token")).toBeInTheDocument();
    expect(screen.getByText("user: Intern")).toBeInTheDocument();
    expect(localStorage.getItem("auth_token")).toBe("new-token");
    expect(JSON.parse(localStorage.getItem("auth_user")!)).toEqual(testUser);
  });

  it("logout clears localStorage and the state, then goes to /login", async () => {
    // jsdom cannot navigate, so replace window.location with a plain object.
    const location = { href: "http://localhost/applications" };
    vi.stubGlobal("location", location);
    localStorage.setItem("auth_token", "saved-token");
    localStorage.setItem("auth_user", JSON.stringify(testUser));
    const user = userEvent.setup();
    renderProvider();

    await user.click(screen.getByRole("button", { name: "Log out" }));

    expect(screen.getByText("token: none")).toBeInTheDocument();
    expect(screen.getByText("user: none")).toBeInTheDocument();
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(location.href).toBe("/login");
  });
});
