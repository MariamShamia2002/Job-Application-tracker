import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApplicationStatus } from "@/api/applications";
import { isUnauthorized } from "@/api/errors";
import type { ApplicationStatus, ApplicationsResponse } from "@/api/types";
import { useAuth } from "@/features/auth/useAuth";
import { applicationKeys } from "./queryKeys";

export function useUpdateApplicationStatus() {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: ApplicationStatus;
    }) => updateApplicationStatus(token!, id, { status }),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: applicationKeys.lists() });

      const previous = queryClient.getQueriesData<ApplicationsResponse>({
        queryKey: applicationKeys.lists(),
      });

      queryClient.setQueriesData<ApplicationsResponse>(
        { queryKey: applicationKeys.lists() },
        (current) => {
          if (!current) return current;
          return {
            ...current,
            data: current.data.map((application) =>
              application.id === id
                ? { ...application, status }
                : application,
            ),
          };
        },
      );

      return { previous };
    },

    onError: (error, _variables, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      if (isUnauthorized(error)) {
        logout();
      }
    },

    onSuccess: (updated) => {
      queryClient.setQueriesData<ApplicationsResponse>(
        { queryKey: applicationKeys.lists() },
        (current) => {
          if (!current) return current;
          return {
            ...current,
            data: current.data.map((application) =>
              application.id === updated.id ? updated : application,
            ),
          };
        },
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
}
