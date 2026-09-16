import { apiClient } from "./client";
import type {
  CreateInterviewRoundInput,
  InterviewRound,
  UpdateInterviewRoundInput,
} from "./types";


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

export function updateInterviewRound(
  token: string,
  roundId: string,
  data: UpdateInterviewRoundInput,
) {
  return apiClient<InterviewRound>(
    `/api/interview-rounds/${roundId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    },
  );
}

export function deleteInterviewRound(
  token: string,
  roundId: string,
) {
  return apiClient<void>(
    `/api/interview-rounds/${roundId}`,
    {
      method: "DELETE",
      token,
    },
  );
}