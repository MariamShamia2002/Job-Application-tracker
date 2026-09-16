import type { ApplicationFormValues, FormFieldErrors } from "./types";
import { getFieldsForStep, type FormStepId } from "./steps";
import { validateAttachment } from "@/features/attachments/validation";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function todayISODate() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function normalizeHttpUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(normalizeHttpUrl(value));
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseSalary(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export function validateForm(
  values: ApplicationFormValues,
  step?: FormStepId,
): FormFieldErrors {
  const errors: FormFieldErrors = {};
  const today = todayISODate();

  if (!values.company.trim()) {
    errors.company = "Company is required";
  }

  if (!values.role.trim()) {
    errors.role = "Role is required";
  }

  if (values.companyWebsite.trim() && !isHttpUrl(values.companyWebsite)) {
    errors.companyWebsite = "Must be a valid http(s) URL";
  }

  if (values.workMode !== "remote" && !values.location.trim()) {
    errors.location = `Required when work mode is '${values.workMode}'`;
  }

  if (values.status !== "saved" && !values.appliedDate) {
    errors.appliedDate = "Required when status is not 'saved'";
  }

  if (values.appliedDate && values.appliedDate > today) {
    errors.appliedDate = "Applied date cannot be in the future";
  }

  if (values.source === "referral" && !values.referralName.trim()) {
    errors.referralName = "Required when source is 'referral'";
  }

  if (
    values.deadlineDate &&
    values.status === "saved" &&
    values.deadlineDate < today
  ) {
    errors.deadlineDate = "Deadline cannot be in the past";
  }

  if (values.recruiterEmail.trim() && !EMAIL_PATTERN.test(values.recruiterEmail.trim())) {
    errors.recruiterEmail = "Must be a valid email address";
  }

  const salaryMin = parseSalary(values.salaryMin);
  const salaryMax = parseSalary(values.salaryMax);

  if (Number.isNaN(salaryMin)) {
    errors.salaryMin = "Must be a number";
  }

  if (Number.isNaN(salaryMax)) {
    errors.salaryMax = "Must be a number";
  }

  if (
    salaryMin !== null &&
    salaryMax !== null &&
    !Number.isNaN(salaryMin) &&
    !Number.isNaN(salaryMax) &&
    salaryMin > salaryMax
  ) {
    errors.salaryMin = "Must be less than or equal to the maximum salary";
  }

  const resumeError = validateAttachment(values.resumeFile);
  if (resumeError) errors.resumeFile = resumeError;

  const coverLetterError = validateAttachment(values.coverLetterFile);
  if (coverLetterError) errors.coverLetterFile = coverLetterError;

  if (!step) return errors;

  const fields = new Set(getFieldsForStep(step));
  const scoped: FormFieldErrors = {};
  for (const [field, message] of Object.entries(errors)) {
    if (fields.has(field as keyof ApplicationFormValues) && message) {
      scoped[field as keyof ApplicationFormValues] = message;
    }
  }
  return scoped;
}

export function stepNeedsAttention(
  values: ApplicationFormValues,
  step: FormStepId,
) {
  return Object.keys(validateForm(values, step)).length > 0;
}
