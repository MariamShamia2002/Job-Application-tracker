import type { CreateApplicationInput } from "@/api/types";
import type { ApplicationFormValues } from "./types";
import { normalizeHttpUrl } from "./validation";

function optionalText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function optionalNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function toCreateInput(
  values: ApplicationFormValues,
): CreateApplicationInput {
  return {
    company: values.company.trim(),
    role: values.role.trim(),
    employmentType: values.employmentType,
    workMode: values.workMode,
    status: values.status,
    priority: values.priority,
    salaryCurrency: values.salaryCurrency,
    equityOffered: values.equityOffered,
    companyWebsite: values.companyWebsite.trim()
      ? normalizeHttpUrl(values.companyWebsite)
      : undefined,
    department: optionalText(values.department),
    location:
      values.workMode === "remote" ? undefined : optionalText(values.location),
    seniorityLevel: values.seniorityLevel || undefined,
    appliedDate: optionalText(values.appliedDate),
    deadlineDate: optionalText(values.deadlineDate),
    source: values.source || undefined,
    referralName: optionalText(values.referralName),
    recruiterName: optionalText(values.recruiterName),
    recruiterEmail: optionalText(values.recruiterEmail),
    salaryMin: optionalNumber(values.salaryMin),
    salaryMax: optionalNumber(values.salaryMax),
    jobDescription: optionalText(values.jobDescription),
    tags: values.tags,
    notes: optionalText(values.notes),
  };
}
