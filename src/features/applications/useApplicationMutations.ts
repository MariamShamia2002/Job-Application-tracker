import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { deleteApplication, updateApplication } from "@/api/applications";
import { isUnauthorized } from "@/api/errors";
import type { Application } from "@/api/types";
import { useAuth } from "@/features/auth/useAuth";
import { applicationKeys } from "./queryKeys";

function useInvalidateApplication(onErrorExtra?: (error: unknown) => void) {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  function handleError(error: unknown) {
    if (isUnauthorized(error)) logout();
    onErrorExtra?.(error);
  }

  function setDetail(updated: Application) {
    queryClient.setQueryData(applicationKeys.detail(updated.id), updated);
  }

  return { token, queryClient, handleError, setDetail };
}

export function useArchiveApplication(applicationId: string) {
  const { token, queryClient, handleError, setDetail } =
    useInvalidateApplication();

  return useMutation({
    mutationFn: (archived: boolean) =>
      updateApplication(token!, applicationId, { archived }),
    onSuccess: (updated) => {
      setDetail(updated);
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
    onError: handleError,
  });
}

export function useDeleteApplication() {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (applicationId: string) =>
      deleteApplication(token!, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      navigate("/applications");
    },
    onError: (error) => {
      if (isUnauthorized(error)) logout();
    },
  });
}
