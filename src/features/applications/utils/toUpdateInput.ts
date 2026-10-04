import type { UpdateApplicationInput } from "@/features/applications/types/application";
import type { ApplicationFormValues } from "../types/applicationForm";
import { toCreateInput } from "./toCreateInput";

// Optional fields the user can empty in the form. JSON.stringify drops
const CLEARABLE_FIELDS = [
  "companyWebsite",
  "department",
  "location",
  "seniorityLevel",
  "appliedDate",
  "deadlineDate",
  "source",
  "referralName",
  "recruiterName",
  "recruiterEmail",
  "salaryMin",
  "salaryMax",
  "jobDescription",
  "notes",
] as const satisfies readonly (keyof UpdateApplicationInput)[];

export function toUpdateInput(values: ApplicationFormValues): UpdateApplicationInput {
  const input: UpdateApplicationInput = toCreateInput(values);

  for (const field of CLEARABLE_FIELDS) {
    if (input[field] === undefined) input[field] = null;
  }

  return input;
}
