import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteCoverLetter,
  deleteResume,
  downloadCoverLetter,
  downloadResume,
  uploadCoverLetter,
  uploadResume,
} from "@/features/attachments/api/attachments";
import type { Application } from "@/features/applications/types/application";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { applicationKeys } from "@/features/applications/utils/queryKeys";
import { validateAttachment } from "../utils/validation";

export function useApplicationAttachments(applicationId: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

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
