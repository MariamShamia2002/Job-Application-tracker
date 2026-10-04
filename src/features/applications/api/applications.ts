import { apiClient, apiRequest } from "@/api/client";
import type { Application, ApplicationsFilters, ApplicationsResponse, CreateApplicationInput, UpdateApplicationInput, UpdateStatusInput } from "../types/application";

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

// Uses apiRequest (not apiClient) to keep the full { data, meta } body so callers can read meta.count.
export function getApplications(
  token: string,
  filters?: ApplicationsFilters,
) {
  return apiRequest<ApplicationsResponse>(
    `/api/applications${buildQuery(filters)}`,
    { token },
  );
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