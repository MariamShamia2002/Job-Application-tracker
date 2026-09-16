import { apiClient } from "./client";
import type { CreateInterviewRoundInput, InterviewRound } from "./types";

export function getInterviewRounds(
  token: string,
  applicationId: string,
) {
  return apiClient<InterviewRound[]>(
    `/api/applications/${applicationId}/interview-rounds`,
    {
      method: "GET",
      token,
    },
  );
}

export function createInterviewRound(
  token: string,
  applicationId: string,
  data: CreateInterviewRoundInput,
) {
  return apiClient<InterviewRound>(
    `/api/applications/${applicationId}/interview-rounds`,
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    },
  );
}

