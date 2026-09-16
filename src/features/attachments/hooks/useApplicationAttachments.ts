import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteCoverLetter,
  deleteResume,
  downloadCoverLetter,
  downloadResume,
  uploadCoverLetter,
  uploadResume,
} from "@/api/attachments";
import { isUnauthorized } from "@/api/errors";
import type { Application } from "@/api/types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { applicationKeys } from "@/features/applications/queryKeys";
import { validateAttachment } from "../validation";

export function useApplicationAttachments(applicationId: string) {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  function onError(error: unknown) {
    if (isUnauthorized(error)) logout();
  }

  function onUploaded(updated: Application) {
    queryClient.setQueryData(applicationKeys.detail(updated.id), updated);
    queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
  }

  const uploadResumeMutation = useMutation({
    mutationFn: (file: File) => {
      const error = validateAttachment(file);
      if (error) {
        throw {
          status: 400,
          error: { code: "VALIDATION_ERROR", message: error },
        };
      }
      return uploadResume(token!, applicationId, file);
    },
    onSuccess: onUploaded,
    onError,
  });

  const uploadCoverLetterMutation = useMutation({
    mutationFn: (file: File) => {
      const error = validateAttachment(file);
      if (error) {
        throw {
          status: 400,
          error: { code: "VALIDATION_ERROR", message: error },
        };
      }
      return uploadCoverLetter(token!, applicationId, file);
    },
    onSuccess: onUploaded,
    onError,
  });

  const deleteResumeMutation = useMutation({
    mutationFn: () => deleteResume(token!, applicationId),
    onSuccess: () => {
      queryClient.setQueryData<Application>(
        applicationKeys.detail(applicationId),
        (current) =>
          current
            ? { ...current, hasResume: false, resumeFileName: null }
            : current,
      );
      queryClient.invalidateQueries({
        queryKey: applicationKeys.detail(applicationId),
      });
    },
    onError,
  });

  const deleteCoverLetterMutation = useMutation({
    mutationFn: () => deleteCoverLetter(token!, applicationId),
    onSuccess: () => {
      queryClient.setQueryData<Application>(
        applicationKeys.detail(applicationId),
        (current) =>
          current
            ? { ...current, hasCoverLetter: false, coverLetterFileName: null }
            : current,
      );
      queryClient.invalidateQueries({
        queryKey: applicationKeys.detail(applicationId),
      });
    },
    onError,
  });

  return {
    uploadResume: uploadResumeMutation,
    uploadCoverLetter: uploadCoverLetterMutation,
    deleteResume: deleteResumeMutation,
    deleteCoverLetter: deleteCoverLetterMutation,
    downloadResume: () => downloadResume(token!, applicationId),
    downloadCoverLetter: () => downloadCoverLetter(token!, applicationId),
  };
}
