import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/test/server";
import { renderWithProviders } from "@/test/render";
import LoginPage from "./LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
const API = "http://api.test";
describe("LoginPage", () => {
	it("shows errors when the form is submitted empty", async () => {
		const user = userEvent.setup();
		renderWithProviders(<LoginPage />, { route: "/login" });
		await user.click(screen.getByRole("button", { name: "Sign in" }));
		expect(await screen.findByText("Email is required")).toBeInTheDocument();
		expect(screen.getByText("Password is required")).toBeInTheDocument();
	});
	it("shows a message when the password is wrong", async () => {
		server.use(http.post(`${API}/api/auth/login`, () => HttpResponse.json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials" } }, { status: 401 })));
		const user = userEvent.setup();
		renderWithProviders(<LoginPage />, { route: "/login" });
		await user.type(screen.getByLabelText("Email"), "intern@example.com");
		await user.type(screen.getByLabelText("Password"), "wrong-password");
		await user.click(screen.getByRole("button", { name: "Sign in" }));
		expect(await screen.findByText("Incorrect email or password.")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toHaveAccessibleDescription("Incorrect email or password.");
		expect(localStorage.getItem("auth_token")).toBeNull();
	});
	it("saves the token and leaves the page after a successful login", async () => {
		server.use(
			http.post(`${API}/api/auth/login`, () =>
				HttpResponse.json({
					data: {
						token: "test-token",
						user: { id: "1", email: "intern@example.com", name: "Intern", createdAt: "" },
					},
				}),
			),
		);
		const user = userEvent.setup();
		renderWithProviders(<LoginPage />, { route: "/login" });
		await user.type(screen.getByLabelText("Email"), "intern@example.com");
		await user.type(screen.getByLabelText("Password"), "Password123!");
		await user.click(screen.getByRole("button", { name: "Sign in" }));
		expect(await screen.findByText("Navigated away")).toBeInTheDocument();
		expect(localStorage.getItem("auth_token")).toBe("test-token");
		expect(JSON.parse(localStorage.getItem("auth_user")!)).toEqual({
			id: "1",
			email: "intern@example.com",
			name: "Intern",
			createdAt: "",
		});
	});
});

const testUser = { id: "1", email: "intern@example.com", name: "Intern", createdAt: "" };

// Real /login and protected /applications routes, so tests can check where the user ends up.
function renderApp(initialPath: string) {
	const router = createMemoryRouter(
		[
			{ path: "/login", element: <LoginPage /> },
			{
				element: <ProtectedRoute />,
				children: [{ path: "/applications", element: <p>Applications page</p> }],
			},
		],
		{ initialEntries: [initialPath] },
	);

	render(
		<QueryClientProvider client={new QueryClient()}>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</QueryClientProvider>,
	);

	return router;
}

async function submitLogin(email: string, password: string) {
	const user = userEvent.setup();
	if (email) await user.type(screen.getByLabelText("Email"), email);
	if (password) await user.type(screen.getByLabelText("Password"), password);
	await user.click(screen.getByRole("button", { name: "Sign in" }));
}

describe("LoginPage: more cases", () => {
	it("shows a message for an invalid email format", async () => {
		renderApp("/login");

		await submitLogin("not-an-email", "Password123!");

		expect(await screen.findByText("Enter a valid email address")).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
	});

	it("does not call the API when the form is invalid", async () => {
		let called = false;
		server.use(
			http.post(`${API}/api/auth/login`, () => {
				called = true;
				return HttpResponse.json({ data: { token: "t", user: testUser } });
			}),
		);
		renderApp("/login");

		await submitLogin("", "");

		expect(await screen.findByText("Email is required")).toBeInTheDocument();
		expect(called).toBe(false);
	});

	it("shows the 401 message under the password input", async () => {
		server.use(http.post(`${API}/api/auth/login`, () => HttpResponse.json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials" } }, { status: 401 })));
		renderApp("/login");

		await submitLogin("intern@example.com", "wrong-password");

		await screen.findByText("Incorrect email or password.");
		expect(screen.getByLabelText("Password")).toHaveAccessibleDescription("Incorrect email or password.");
		expect(localStorage.getItem("auth_token")).toBeNull();
	});

	it("shows server field errors (400) under the right input", async () => {
		server.use(
			http.post(`${API}/api/auth/login`, () =>
				HttpResponse.json(
					{
						error: {
							code: "VALIDATION_ERROR",
							message: "Validation failed",
							fields: { email: "No account uses this email" },
						},
					},
					{ status: 400 },
				),
			),
		);
		renderApp("/login");

		await submitLogin("intern@example.com", "Password123!");

		await screen.findByText("No account uses this email");
		expect(screen.getByLabelText("Email")).toHaveAccessibleDescription("No account uses this email");
		expect(screen.getByLabelText("Password")).not.toHaveAttribute("aria-invalid", "true");
	});

	it("goes to /applications after a successful login", async () => {
		server.use(http.post(`${API}/api/auth/login`, () => HttpResponse.json({ data: { token: "test-token", user: testUser } })));
		const router = renderApp("/login");

		await submitLogin("intern@example.com", "Password123!");

		expect(await screen.findByText("Applications page")).toBeInTheDocument();
		expect(router.state.location.pathname).toBe("/applications");
	});

	it("sends an already logged-in user from /login to /applications", async () => {
		localStorage.setItem("auth_token", "existing-token");
		localStorage.setItem("auth_user", JSON.stringify(testUser));

		const router = renderApp("/login");

		expect(await screen.findByText("Applications page")).toBeInTheDocument();
		expect(router.state.location.pathname).toBe("/applications");
	});
});
