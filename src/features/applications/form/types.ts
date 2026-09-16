import type {
  ApplicationSource,
  ApplicationStatus,
  EmploymentType,
  Priority,
  SalaryCurrency,
  SeniorityLevel,
  WorkMode,
} from "@/api/types";

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

export const EMPTY_FORM_VALUES: ApplicationFormValues = {
  company: "",
  companyWebsite: "",
  role: "",
  department: "",
  employmentType: "full_time",
  workMode: "hybrid",
  location: "",
  seniorityLevel: "",
  source: "",
  status: "saved",
  appliedDate: "",
  deadlineDate: "",
  referralName: "",
  recruiterName: "",
  recruiterEmail: "",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "USD",
  equityOffered: false,
  priority: "medium",
  jobDescription: "",
  tags: [],
  notes: "",
  resumeFile: null,
  coverLetterFile: null,
};
