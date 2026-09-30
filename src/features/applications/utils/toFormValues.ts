import type { Application } from "@/features/applications/types/application";
import type { ApplicationFormValues } from "../types/applicationForm";
import { EMPTY_FORM_VALUES } from "./formDefaults";

export function toFormValues(application: Application): ApplicationFormValues {
  return {
    ...EMPTY_FORM_VALUES,
    company: application.company,
    companyWebsite: application.companyWebsite ?? "",
    role: application.role,
    department: application.department ?? "",
    employmentType: application.employmentType,
    workMode: application.workMode,
    location: application.location ?? "",
    seniorityLevel: application.seniorityLevel ?? "",
    source: application.source ?? "",
    status: application.status,
    appliedDate: application.appliedDate?.slice(0, 10) ?? "",
    deadlineDate: application.deadlineDate?.slice(0, 10) ?? "",
    referralName: application.referralName ?? "",
    recruiterName: application.recruiterName ?? "",
    recruiterEmail: application.recruiterEmail ?? "",
    salaryMin: application.salaryMin != null ? String(application.salaryMin) : "",
    salaryMax: application.salaryMax != null ? String(application.salaryMax) : "",
    salaryCurrency: application.salaryCurrency,
    equityOffered: application.equityOffered,
    priority: application.priority,
    jobDescription: application.jobDescription ?? "",
    tags: application.tags ?? [],
    notes: application.notes ?? "",
    resumeFile: null,
    coverLetterFile: null,
  };
}
