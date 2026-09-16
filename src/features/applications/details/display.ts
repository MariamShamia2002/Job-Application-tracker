import type { Application, SalaryCurrency } from "@/api/types";
import { CURRENCY_LABELS } from "../labels";

export function applicationCode(id: string) {
  return `APP-${id.replace(/-/g, "").slice(-4).toUpperCase()}`;
}

export function formatSalary(
  min: number | null,
  max: number | null,
  currency: SalaryCurrency,
) {
  if (min == null && max == null) return "Not disclosed";
  const amount =
    min != null && max != null
      ? `${min.toLocaleString()}–${max.toLocaleString()}`
      : `${(min ?? max)!.toLocaleString()}`;
  return `${amount} ${CURRENCY_LABELS[currency]}`;
}

export function displayOrDash(value: string | null | undefined) {
  return value?.trim() ? value : "—";
}

export function applicationHeadline(application: Application) {
  return [application.role, application.department].filter(Boolean).join(" · ");
}
