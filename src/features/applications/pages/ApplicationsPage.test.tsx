import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeApplication } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";
import { server } from "@/test/server";
import type { Application } from "../types/application";
import ApplicationsPage from "./ApplicationsPage";

const API = import.meta.env.VITE_API_URL;

const acme = makeApplication({ id: "1", company: "Acme", role: "Frontend Engineer", status: "applied" });
const globex = makeApplication({ id: "2", company: "Globex", role: "Data Analyst", status: "saved" });

// Answers GET /api/applications and records the query string of every request.
function mockList(applications: Application[] = [acme, globex]) {
  const requests: URLSearchParams[] = [];
  server.use(
    http.get(`${API}/api/applications`, ({ request }) => {
      requests.push(new URL(request.url).searchParams);
      return HttpResponse.json({ data: applications, meta: { count: applications.length } });
    }),
  );
  return requests;
}

function renderPage() {
  renderWithProviders(<ApplicationsPage />, { route: "/applications" });
}

function rowFor(company: string) {
  return screen.getByText(company).closest("tr")!;
}

beforeEach(() => {
  localStorage.setItem("auth_token", "test-token");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ApplicationsPage", () => {
  describe("loading and data", () => {
    it("shows a loading skeleton, then the rows from the API", async () => {
      mockList();
      renderPage();

      expect(screen.getByRole("status", { name: "Loading applications" })).toBeInTheDocument();

      expect(await screen.findByText("Acme")).toBeInTheDocument();
      expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
      expect(screen.getByText("Globex")).toBeInTheDocument();
      expect(screen.queryByRole("status", { name: "Loading applications" })).not.toBeInTheDocument();
      expect(screen.getByText("2 of 2 shown")).toBeInTheDocument();
    });

    it("sends the token with the request", async () => {
      let authorization: string | null = null;
      server.use(
        http.get(`${API}/api/applications`, ({ request }) => {
          authorization = request.headers.get("Authorization");
          return HttpResponse.json({ data: [], meta: { count: 0 } });
        }),
      );
      renderPage();

      await screen.findByText("No applications yet");
      expect(authorization).toBe("Bearer test-token");
    });
  });

  describe("empty state", () => {
    it("shows the empty state when there is no data", async () => {
      mockList([]);
      renderPage();

      expect(await screen.findByText("No applications yet")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();
    });

    it("offers 'Clear filters' when filters are active, and clearing resets the request", async () => {
      const requests = mockList([]);
      const user = userEvent.setup();
      renderPage();
      await screen.findByText("No applications yet");

      await user.click(screen.getByRole("switch"));

      expect(await screen.findByText("No applications match these filters")).toBeInTheDocument();
      expect(requests.at(-1)!.get("archived")).toBe("true");

      await user.click(screen.getByRole("button", { name: "Clear filters" }));

      expect(await screen.findByText("No applications yet")).toBeInTheDocument();
      expect(requests.at(-1)!.get("archived")).toBe("false");
    });
  });

  describe("search and filters", () => {
    it("sends ?search=... only after the 300 ms debounce", async () => {
      const requests = mockList();
      const user = userEvent.setup();
      renderPage();
      await screen.findByText("Acme");

      await user.type(screen.getByPlaceholderText("Search company or role"), "acme");

      // Typing finishes well inside 300 ms, so no search request has gone out yet.
      expect(requests.some((params) => params.has("search"))).toBe(false);

      await waitFor(() => expect(requests.at(-1)!.get("search")).toBe("acme"));
      // One request for the final text, not one per keystroke.
      expect(requests.filter((params) => params.has("search"))).toHaveLength(1);
    });

    it("trims the search text", async () => {
      const requests = mockList();
      const user = userEvent.setup();
      renderPage();
      await screen.findByText("Acme");

      await user.type(screen.getByPlaceholderText("Search company or role"), "  acme  ");

      await waitFor(() => expect(requests.at(-1)!.get("search")).toBe("acme"));
    });

    it.each([
      ["status", "Filter by status", "Phone screen", "phone_screen"],
      ["source", "Filter by source", "Referral", "referral"],
      ["priority", "Filter by priority", "High", "high"],
    ])("choosing a %s filter changes the request", async (param, label, option, value) => {
      const requests = mockList();
      const user = userEvent.setup();
      renderPage();
      await screen.findByText("Acme");
      expect(requests.at(-1)!.has(param)).toBe(false);

      await user.click(screen.getByRole("combobox", { name: label }));
      await user.click(await screen.findByRole("option", { name: option }));

      await waitFor(() => expect(requests.at(-1)!.get(param)).toBe(value));
    });
  });

  describe("errors", () => {
    it("shows the error banner on a 500, and Retry calls the API again", async () => {
      let calls = 0;
      server.use(
        http.get(`${API}/api/applications`, () => {
          calls += 1;
          if (calls === 1) {
            return HttpResponse.json(
              { error: { code: "INTERNAL_ERROR", message: "Database is down" } },
              { status: 500 },
            );
          }
          return HttpResponse.json({ data: [acme], meta: { count: 1 } });
        }),
      );
      const user = userEvent.setup();
      renderPage();

      expect(await screen.findByText("Couldn’t load applications")).toBeInTheDocument();
      expect(screen.getByText("Database is down")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Retry" }));

      expect(await screen.findByText("Acme")).toBeInTheDocument();
      expect(calls).toBe(2);
      expect(screen.queryByText("Couldn’t load applications")).not.toBeInTheDocument();
    });

    it("logs the user out on a 401", async () => {
      const location = { replace: vi.fn() };
      vi.stubGlobal("location", location);
      localStorage.setItem("auth_user", JSON.stringify({ id: "1" }));
      server.use(
        http.get(`${API}/api/applications`, () =>
          HttpResponse.json(
            { error: { code: "UNAUTHORIZED", message: "Token expired" } },
            { status: 401 },
          ),
        ),
      );
      renderPage();

      await waitFor(() => expect(location.replace).toHaveBeenCalledWith("/login"));
      expect(localStorage.getItem("auth_token")).toBeNull();
      expect(localStorage.getItem("auth_user")).toBeNull();
      expect(screen.queryByText("Couldn’t load applications")).not.toBeInTheDocument();
    });
  });

  describe("changing a status", () => {
    async function changeStatus(company: string, newStatus: string) {
      const user = userEvent.setup();
      await user.click(within(rowFor(company)).getByRole("button", { name: "Change status" }));
      await user.click(await screen.findByRole("menuitemradio", { name: newStatus }));
    }

    it("updates the row immediately, before the server answers", async () => {
      mockList();
      let respond!: () => void;
      const serverAnswered = new Promise<void>((resolve) => (respond = resolve));
      server.use(
        http.patch(`${API}/api/applications/1/status`, async () => {
          await serverAnswered;
          return HttpResponse.json({ data: { ...acme, status: "offer" } });
        }),
      );
      renderPage();
      await screen.findByText("Acme");

      await changeStatus("Acme", "Offer");

      expect(within(rowFor("Acme")).getByText("Offer")).toBeInTheDocument();
      respond();
    });

    it("goes back to the old status and shows an error when the server fails", async () => {
      // The first list load answers; later refetches never do, so only the
      // rollback (not fresh server data) can restore the old status.
      let listCalls = 0;
      server.use(
        http.get(`${API}/api/applications`, async () => {
          listCalls += 1;
          if (listCalls > 1) await new Promise(() => {});
          return HttpResponse.json({ data: [acme, globex], meta: { count: 2 } });
        }),
      );
      let respond!: () => void;
      const serverAnswered = new Promise<void>((resolve) => (respond = resolve));
      server.use(
        http.patch(`${API}/api/applications/1/status`, async () => {
          await serverAnswered;
          return HttpResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Nope" } },
            { status: 500 },
          );
        }),
      );
      renderPage();
      await screen.findByText("Acme");

      await changeStatus("Acme", "Offer");
      expect(within(rowFor("Acme")).getByText("Offer")).toBeInTheDocument();

      respond();

      expect(await screen.findByText("Status change didn’t save")).toBeInTheDocument();
      expect(within(rowFor("Acme")).getByText("Applied")).toBeInTheDocument();
      expect(within(rowFor("Acme")).queryByText("Offer")).not.toBeInTheDocument();
    });
  });
});

