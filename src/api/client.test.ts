import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import { server } from "@/test/server";
import { apiClient, apiFetch, apiRequest } from "./client";

const API = "http://api.test";

describe("apiClient", () => {
  it("returns body.data from a successful call", async () => {
    server.use(
      http.get(`${API}/api/things`, () =>
        HttpResponse.json({ data: [{ id: "1" }], meta: { count: 1 } }),
      ),
    );

    await expect(apiClient("/api/things")).resolves.toEqual([{ id: "1" }]);
  });

  it("returns undefined for a 204 No Content", async () => {
    server.use(
      http.delete(`${API}/api/things/1`, () => new HttpResponse(null, { status: 204 })),
    );

    await expect(apiClient("/api/things/1", { method: "DELETE" })).resolves.toBeUndefined();
  });

  it("passes the server's error envelope through as an ApiError", async () => {
    server.use(
      http.get(`${API}/api/things/404`, () =>
        HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "Application not found" } },
          { status: 404 },
        ),
      ),
    );

    await expect(apiClient("/api/things/404")).rejects.toEqual({
      status: 404,
      error: { code: "NOT_FOUND", message: "Application not found" },
    });
  });

  it("turns a non-JSON error into a typed ApiError", async () => {
    server.use(
      http.get(`${API}/api/things`, () =>
        new HttpResponse("<html>Bad gateway</html>", {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/html" },
        }),
      ),
    );

    await expect(apiClient("/api/things")).rejects.toEqual({
      status: 503,
      error: { code: "SERVICE_UNAVAILABLE", message: "Service Unavailable" },
    });
  });

  it("sends the token as Authorization: Bearer", async () => {
    let authorization: string | null = null;
    server.use(
      http.get(`${API}/api/things`, ({ request }) => {
        authorization = request.headers.get("Authorization");
        return HttpResponse.json({ data: [] });
      }),
    );

    await apiClient("/api/things", { token: "abc123" });

    expect(authorization).toBe("Bearer abc123");
  });

  it("sends no Authorization header without a token", async () => {
    let hasAuthorization = true;
    server.use(
      http.get(`${API}/api/things`, ({ request }) => {
        hasAuthorization = request.headers.has("Authorization");
        return HttpResponse.json({ data: [] });
      }),
    );

    await apiClient("/api/things");

    expect(hasAuthorization).toBe(false);
  });

  it("sends JSON bodies with Content-Type: application/json", async () => {
    let contentType: string | null = null;
    server.use(
      http.post(`${API}/api/things`, ({ request }) => {
        contentType = request.headers.get("Content-Type");
        return HttpResponse.json({ data: {} });
      }),
    );

    await apiClient("/api/things", { method: "POST", body: JSON.stringify({ a: 1 }) });

    expect(contentType).toBe("application/json");
  });

  it("does not set Content-Type to JSON for FormData uploads", async () => {
    let contentType: string | null = null;
    server.use(
      http.post(`${API}/api/upload`, ({ request }) => {
        contentType = request.headers.get("Content-Type");
        return HttpResponse.json({ data: {} });
      }),
    );

    const body = new FormData();
    body.append("resume", new File(["x"], "cv.pdf", { type: "application/pdf" }));
    await apiClient("/api/upload", { method: "POST", body });

    expect(contentType).not.toBe("application/json");
    expect(contentType).toMatch(/^multipart\/form-data; boundary=/);
  });
});

describe("apiRequest", () => {
  it("returns the whole JSON body, including meta", async () => {
    server.use(
      http.get(`${API}/api/things`, () =>
        HttpResponse.json({ data: [{ id: "1" }], meta: { count: 1 } }),
      ),
    );

    await expect(apiRequest("/api/things")).resolves.toEqual({
      data: [{ id: "1" }],
      meta: { count: 1 },
    });
  });

  it("throws the same typed ApiError as apiClient", async () => {
    server.use(
      http.get(`${API}/api/things`, () => new HttpResponse(null, { status: 500 })),
    );

    await expect(apiRequest("/api/things")).rejects.toMatchObject({
      status: 500,
      error: { code: "INTERNAL_ERROR" },
    });
  });
});

describe("apiFetch", () => {
  it("returns the raw response so callers can read a file", async () => {
    server.use(
      http.get(`${API}/api/file`, () =>
        new HttpResponse("file contents", { headers: { "Content-Type": "application/pdf" } }),
      ),
    );

    const response = await apiFetch("/api/file", { token: "abc123" });

    await expect(response.text()).resolves.toBe("file contents");
  });
});

describe("401 handling", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function stubLocation() {
    const location = { replace: vi.fn() };
    vi.stubGlobal("location", location);
    return location;
  }

  it("clears the saved login and goes to /login when a logged-in request gets a 401", async () => {
    const location = stubLocation();
    localStorage.setItem("auth_token", "expired-token");
    localStorage.setItem("auth_user", "{}");
    server.use(
      http.get(`${API}/api/things`, () => new HttpResponse(null, { status: 401 })),
    );

    await expect(apiClient("/api/things", { token: "expired-token" })).rejects.toMatchObject({
      status: 401,
    });
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(location.replace).toHaveBeenCalledWith("/login");
  });

  it("does not redirect on a 401 without a token, such as a wrong password", async () => {
    const location = stubLocation();
    server.use(
      http.post(`${API}/api/auth/login`, () => new HttpResponse(null, { status: 401 })),
    );

    await expect(apiClient("/api/auth/login", { method: "POST" })).rejects.toMatchObject({
      status: 401,
    });
    expect(location.replace).not.toHaveBeenCalled();
  });
});
