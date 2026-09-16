import type { Application, SalaryCurrency } from "@/api/types";
import { CURRENCY_LABELS } from "../labels";

export function applicationCode(id: string) {
  return `APP-${id.replace(/-/g, "").slice(-4).toUpperCase()}`;
}

export function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    const day = iso.slice(0, 10);
    const time = iso.slice(11, 16);
    return time ? `${day} ${time}` : day;
  }
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString();
  return `${local.slice(0, 10)} ${local.slice(11, 16)}`;
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

export function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function applicationHeadline(application: Application) {
  return [application.role, application.department].filter(Boolean).join(" · ");
}

export function fileExtension(fileName: string | null) {
  if (!fileName) return "FILE";
  const ext = fileName.split(".").pop()?.trim();
  return ext ? ext.toUpperCase() : "FILE";
}

export function toDateTimeLocal(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 16);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function fromDateTimeLocal(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}
