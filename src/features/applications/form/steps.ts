import type { ApplicationFormValues } from "./types";

export const FORM_STEPS = [
  {
    id: 1,
    title: "Company & Role",
    heading: "Company & role",
    description: "Who you applied to, and for what.",
  },
  {
    id: 2,
    title: "Source & Dates",
    heading: "Source, status & dates",
    description: "How you found it and where it stands.",
  },
  {
    id: 3,
    title: "Compensation",
    heading: "Compensation & priority",
    description: "The numbers, and how badly you want it.",
  },
  {
    id: 4,
    title: "Description",
    heading: "Description, tags & notes",
    description: "Paste the posting and anything worth remembering.",
  },
  {
    id: 5,
    title: "Attachments",
    heading: "Attachments",
    description: "Resume and cover letter upload separately.",
  },
  {
    id: 6,
    title: "Review",
    heading: "Review before saving",
    description: "Check each step, then save the application.",
  },
] as const;

export type FormStepId = (typeof FORM_STEPS)[number]["id"];

export const CONTENT_STEP_COUNT = 5;
export const LAST_STEP = FORM_STEPS.length as FormStepId;

const STEP_FIELDS: Record<FormStepId, readonly (keyof ApplicationFormValues)[]> = {
  1: [
    "company",
    "companyWebsite",
    "role",
    "department",
    "employmentType",
    "workMode",
    "location",
    "seniorityLevel",
  ],
  2: [
    "source",
    "status",
    "appliedDate",
    "deadlineDate",
    "referralName",
    "recruiterName",
    "recruiterEmail",
  ],
  3: ["salaryMin", "salaryMax", "salaryCurrency", "equityOffered", "priority"],
  4: ["jobDescription", "tags", "notes"],
  5: ["resumeFile", "coverLetterFile"],
  6: [],
};

export function getStepForField(field: string): FormStepId | null {
  for (const step of FORM_STEPS) {
    if (STEP_FIELDS[step.id].includes(field as keyof ApplicationFormValues)) {
      return step.id;
    }
  }
  return null;
}

export function getFieldsForStep(step: FormStepId) {
  return STEP_FIELDS[step];
}
