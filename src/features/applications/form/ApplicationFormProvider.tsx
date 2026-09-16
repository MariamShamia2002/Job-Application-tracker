import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ApplicationFormContext } from "./ApplicationFormContext";
import { LAST_STEP, type FormStepId } from "./steps";
import { EMPTY_FORM_VALUES, type ApplicationFormValues, type FormFieldErrors } from "./types";
import { validateForm } from "./validation";

export function ApplicationFormProvider({
  children,
  initialValues,
}: {
  children: ReactNode;
  initialValues?: Partial<ApplicationFormValues>;
}) {
  const [values, setValues] = useState<ApplicationFormValues>({
    ...EMPTY_FORM_VALUES,
    ...initialValues,
  });
  const [step, setStep] = useState<FormStepId>(1);
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});

  const setField = useCallback(
    <K extends keyof ApplicationFormValues>(
      field: K,
      value: ApplicationFormValues[K],
    ) => {
      setValues((current) => {
        const next = { ...current, [field]: value };
        if (field === "workMode" && value === "remote") {
          next.location = "";
        }
        return next;
      });
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[field];
        if (field === "workMode" && value === "remote") {
          delete next.location;
        }
        return next;
      });
    },
    [],
  );

  const goNext = useCallback(() => {
    const errors = validateForm(values, step);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return false;
    setStep((current) => Math.min(current + 1, LAST_STEP) as FormStepId);
    return true;
  }, [step, values]);

  const goBack = useCallback(() => {
    setFieldErrors({});
    setStep((current) => Math.max(current - 1, 1) as FormStepId);
  }, []);

  const goToStep = useCallback(
    (target: FormStepId) => {
      if (target === step) return;
      if (target < step) {
        setFieldErrors({});
        setStep(target);
        return;
      }

      const errors = validateForm(values, step);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) return;
      if (target > step + 1) return;
      setStep(target);
    },
    [step, values],
  );

  const value = useMemo(
    () => ({
      values,
      setField,
      step,
      setStep,
      goToStep,
      goNext,
      goBack,
      fieldErrors,
      setFieldErrors,
    }),
    [fieldErrors, goBack, goNext, goToStep, setField, step, values],
  );

  return (
    <ApplicationFormContext.Provider value={value}>
      {children}
    </ApplicationFormContext.Provider>
  );
}
