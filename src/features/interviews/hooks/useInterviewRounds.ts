import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInterviewRound,
  getInterviewRounds,
} from "@/features/interviews/api/interviews";
import type { CreateInterviewRoundInput, InterviewRound } from "@/features/interviews/types/interview";
import { applicationKeys } from "@/features/applications/utils/queryKeys";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { interviewKeys } from "../utils/queryKeys";

export function useInterviewRounds(applicationId: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: interviewKeys.list(applicationId),
    queryFn: async () => {
      const result = await getInterviewRounds(token!, applicationId);
      return Array.isArray(result) ? result : [];
    },
    enabled: Boolean(token && applicationId),
  });
}

export function useCreateInterviewRound(applicationId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInterviewRoundInput) =>
      createInterviewRound(token!, applicationId, data),
    onSuccess: (created) => {
      queryClient.setQueryData<InterviewRound[]>(
        interviewKeys.list(applicationId),
        (current) => (current ? [...current, created] : [created]),
      );
      queryClient.invalidateQueries({
        queryKey: applicationKeys.detail(applicationId),
      });
    },
  });
}
