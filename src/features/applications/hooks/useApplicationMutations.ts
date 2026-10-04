import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { deleteApplication, updateApplication } from "@/features/applications/api/applications";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { applicationKeys } from "../utils/queryKeys";

export function useArchiveApplication(applicationId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (archived: boolean) =>
      updateApplication(token!, applicationId, { archived }),
    onSuccess: (updated) => {
      queryClient.setQueryData(applicationKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
}

export function useDeleteApplication() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (applicationId: string) =>
      deleteApplication(token!, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      navigate("/applications");
    },
  });
}
