import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInterviewRound,
  getInterviewRounds,
} from "@/api/interviews";
import { isUnauthorized } from "@/api/errors";
import type { CreateInterviewRoundInput, InterviewRound } from "@/api/types";
import { useAuth } from "@/features/auth/useAuth";
import { applicationKeys } from "./queryKeys";

export function useInterviewRounds(applicationId: string) {
  const { token, logout } = useAuth();

  return useQuery({
    queryKey: applicationKeys.interviews(applicationId),
    queryFn: async () => {
      try {
        const result = await getInterviewRounds(token!, applicationId);
        return Array.isArray(result) ? result : [];
      } catch (error) {
        if (isUnauthorized(error)) logout();
        throw error;
      }
    },
    enabled: Boolean(token && applicationId),
  });
}

export function useCreateInterviewRound(applicationId: string) {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInterviewRoundInput) =>
      createInterviewRound(token!, applicationId, data),
    onSuccess: (created) => {
      queryClient.setQueryData<InterviewRound[]>(
        applicationKeys.interviews(applicationId),
        (current) => (current ? [...current, created] : [created]),
      );
      queryClient.invalidateQueries({
        queryKey: applicationKeys.detail(applicationId),
      });
    },
    onError: (error) => {
      if (isUnauthorized(error)) logout();
    },
  });
}
