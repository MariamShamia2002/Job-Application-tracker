import type {
  ApplicationSource,
  ApplicationStatus,
  EmploymentType,
  Priority,
  SalaryCurrency,
  SeniorityLevel,
  WorkMode,
} from "@/features/applications/types/application";
import type { FormStepId } from "@/features/applications/utils/formSteps";

export type ApplicationFormValues = {
  company: string;
  companyWebsite: string;
  role: string;
  department: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  seniorityLevel: SeniorityLevel | "";
  source: ApplicationSource | "";
  status: ApplicationStatus;
  appliedDate: string;
  deadlineDate: string;
  referralName: string;
  recruiterName: string;
  recruiterEmail: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: SalaryCurrency;
  equityOffered: boolean;
  priority: Priority;
  jobDescription: string;
  tags: string[];
  notes: string;
  resumeFile: File | null;
  coverLetterFile: File | null;
};

export type FormFieldErrors = Partial<Record<keyof ApplicationFormValues, string>>;

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
