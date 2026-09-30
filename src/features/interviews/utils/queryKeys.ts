import { applicationKeys } from "@/features/applications/utils/queryKeys";

export const interviewKeys = {
  list: (applicationId: string) =>
    [...applicationKeys.detail(applicationId), "interviews"] as const,
};
