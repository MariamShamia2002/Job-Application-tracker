import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { updateApplication } from "@/api/applications";
import { uploadCoverLetter, uploadResume } from "@/api/attachments";
import { getFieldErrors, isUnauthorized } from "@/api/errors";
import { useAuth } from "@/features/auth/useAuth";
import { applicationKeys } from "../queryKeys";
import { getStepForField } from "./steps";
import { toCreateInput } from "./toCreateInput";
import { useApplicationForm } from "./useApplicationForm";
import { validateForm } from "./validation";

export function useUpdateApplication() {
  const { id } = useParams();
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { values, setFieldErrors, setStep } = useApplicationForm();
  const updatedIdRef = useRef<string | null>(id ?? null);

  const mutation = useMutation({
    mutationFn: async () => {
      const applicationId = updatedIdRef.current ?? id;
      if (!applicationId) {
        throw {
          status: 400,
          error: { code: "VALIDATION_ERROR", message: "Missing application id" },
        };
      }

      await updateApplication(token!, applicationId, toCreateInput(values));
      updatedIdRef.current = applicationId;

      if (values.resumeFile) {
        await uploadResume(token!, applicationId, values.resumeFile);
      }

      if (values.coverLetterFile) {
        await uploadCoverLetter(token!, applicationId, values.coverLetterFile);
      }

      return applicationId;
    },
    onSuccess: (applicationId) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      navigate(`/applications/${applicationId}`);
    },
    onError: (error) => {
      if (isUnauthorized(error)) {
        logout();
        return;
      }

      const errors = getFieldErrors(error);
      if (Object.keys(errors).length === 0) return;

      setFieldErrors(errors);
      const errorStep = getStepForField(Object.keys(errors)[0]);
      if (errorStep) setStep(errorStep);
    },
  });

  function submit() {
    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const errorStep = getStepForField(Object.keys(errors)[0]);
      if (errorStep) setStep(errorStep);
      return;
    }

    mutation.mutate();
  }

  return { ...mutation, submit };
}
