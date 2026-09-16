import { applicationKeys } from "@/features/applications/queryKeys";

export const interviewKeys = {
  list: (applicationId: string) =>
    [...applicationKeys.detail(applicationId), "interviews"] as const,
};
