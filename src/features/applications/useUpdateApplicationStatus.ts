import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApplicationStatus } from "@/api/applications";
import { isUnauthorized } from "@/api/errors";
import type {
  Application,
  ApplicationStatus,
  ApplicationsResponse,
} from "@/api/types";
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
      await queryClient.cancelQueries({ queryKey: applicationKeys.detail(id) });

      const previous = queryClient.getQueriesData<ApplicationsResponse>({
        queryKey: applicationKeys.lists(),
      });
      const previousDetail = queryClient.getQueryData<Application>(
        applicationKeys.detail(id),
      );

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

      if (previousDetail) {
        queryClient.setQueryData(applicationKeys.detail(id), {
          ...previousDetail,
          status,
        });
      }

      return { previous, previousDetail, id };
    },

    onError: (error, _variables, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      if (context?.previousDetail) {
        queryClient.setQueryData(
          applicationKeys.detail(context.id),
          context.previousDetail,
        );
      }

      if (isUnauthorized(error)) {
        logout();
      }
    },

    onSuccess: (updated) => {
      queryClient.setQueryData(applicationKeys.detail(updated.id), updated);
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
