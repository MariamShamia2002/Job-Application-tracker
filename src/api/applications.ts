import { apiClient, API_URL, isErrorEnvelope, statusToCode } from "./client";
import type {
  ApiError,
  Application,
  ApplicationsFilters,
  ApplicationsResponse,
  CreateApplicationInput,
  UpdateApplicationInput,
  UpdateStatusInput,
} from "./types";

function buildQuery(filters?: ApplicationsFilters) {
  if (!filters) return "";

  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.archived !== undefined) params.set("archived", String(filters.archived));
  if (filters.sort) params.set("sort", filters.sort);

  const query = params.toString();
  return query ? `?${query}` : "";
}

/**
 * Returns the full { data, meta } envelope so callers can read meta.count.
 *
 * We cannot use apiClient<T> here because it strips .data from the body.
 * Instead we fetch directly but use the same error shape so callers can
 * still use isApiError / getFieldErrors on a thrown value.
 */
export async function getApplications(
  token: string,
  filters?: ApplicationsFilters,
): Promise<ApplicationsResponse> {
  const res = await fetch(
    `${API_URL}/api/applications${buildQuery(filters)}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    let body: unknown = null;
    try { body = await res.json(); } catch { /* non-JSON body */ }

    const err: ApiError = {
      status: res.status,
      error: isErrorEnvelope(body)
        ? body.error
        : { code: statusToCode(res.status), message: res.statusText || "Request failed" },
    };
    throw err;
  }

  return res.json() as Promise<ApplicationsResponse>;
}


export function getApplication(
  token: string,
  applicationId: string,
) {
  return apiClient<Application>(
    `/api/applications/${applicationId}`,
    {
      method: "GET",
      token,
    },
  );
}

export function createApplication(
  token: string,
  data: CreateApplicationInput,
) {
  return apiClient<Application>("/api/applications", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export function updateApplication(
  token: string,
  applicationId: string,
  data: UpdateApplicationInput,
) {
  return apiClient<Application>(
    `/api/applications/${applicationId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    },
  );
}

export function updateApplicationStatus(
  token: string,
  applicationId: string,
  data: UpdateStatusInput,
) {
  return apiClient<Application>(
    `/api/applications/${applicationId}/status`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    },
  );
}

export function deleteApplication(
  token: string,
  applicationId: string,
) {
  return apiClient<void>(
    `/api/applications/${applicationId}`,
    {
      method: "DELETE",
      token,
    },
  );
}