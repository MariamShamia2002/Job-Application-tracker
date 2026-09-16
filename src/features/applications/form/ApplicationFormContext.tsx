import { createContext } from "react";
import type { FormStepId } from "./steps";
import type { ApplicationFormValues, FormFieldErrors } from "./types";

export interface ApplicationFormContextValue {
  values: ApplicationFormValues;
  setField: <K extends keyof ApplicationFormValues>(
    field: K,
    value: ApplicationFormValues[K],
  ) => void;
  step: FormStepId;
  setStep: (step: FormStepId) => void;
  goToStep: (step: FormStepId) => void;
  goNext: () => void;
  goBack: () => void;
  fieldErrors: FormFieldErrors;
  setFieldErrors: (errors: FormFieldErrors) => void;
}

export const ApplicationFormContext =
  createContext<ApplicationFormContextValue | null>(null);
