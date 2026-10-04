import { apiClient, apiFetch } from "@/api/client";
import type { Application } from "@/features/applications/types/application";

export function uploadResume(
  token: string,
  applicationId: string,
  file: File,
) {
  const formData = new FormData();
  formData.append("resume", file);

  return apiClient<Application>(
    `/api/applications/${applicationId}/resume`,
    {
      method: "POST",
      token,
      body: formData,
    },
  );
}

export function uploadCoverLetter(
  token: string,
  applicationId: string,
  file: File,
) {
  const formData = new FormData();
  formData.append("coverLetter", file);

  return apiClient<Application>(
    `/api/applications/${applicationId}/cover-letter`,
    {
      method: "POST",
      token,
      body: formData,
    },
  );
}

export async function downloadResume(
  token: string,
  applicationId: string,
) {
  return downloadAttachment(
    token,
    `/api/applications/${applicationId}/resume`,
  );
}

export async function downloadCoverLetter(
  token: string,
  applicationId: string,
) {
  return downloadAttachment(
    token,
    `/api/applications/${applicationId}/cover-letter`,
  );
}

export async function deleteResume(
  token: string,
  applicationId: string,
) {
  return apiClient<void>(
    `/api/applications/${applicationId}/resume`,
    {
      method: "DELETE",
      token,
    },
  );
}

export async function deleteCoverLetter(
  token: string,
  applicationId: string,
) {
  return apiClient<void>(
    `/api/applications/${applicationId}/cover-letter`,
    {
      method: "DELETE",
      token,
    },
  );
}


async function downloadAttachment(
  token: string,
  endpoint: string,
) {
  const response = await apiFetch(endpoint, { method: "GET", token });
  return response.blob();
}