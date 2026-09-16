import type { Application } from "@/api/types";
import {
  EMPLOYMENT_TYPE_LABELS,
  formatAppliedDate,
  SENIORITY_LABELS,
  SOURCE_LABELS,
  WORK_MODE_LABELS,
} from "../../labels";
import { displayOrDash, formatSalary } from "../display";
import { DetailItem, DetailsCard } from "./DetailsCard";

export function KeyDetailsCard({ application }: { application: Application }) {
  return (
    <DetailsCard title="Key details">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-border pt-4 sm:grid-cols-3">
        <DetailItem
          label="Employment type"
          value={EMPLOYMENT_TYPE_LABELS[application.employmentType]}
        />
        <DetailItem
          label="Work mode"
          value={WORK_MODE_LABELS[application.workMode]}
        />
        <DetailItem
          label="Location"
          value={displayOrDash(application.location)}
        />
        <DetailItem
          label="Seniority"
          value={
            application.seniorityLevel
              ? SENIORITY_LABELS[application.seniorityLevel]
              : "—"
          }
        />
        <DetailItem
          label="Source"
          value={
            application.source ? SOURCE_LABELS[application.source] : "—"
          }
        />
        <DetailItem
          label="Salary range"
          value={formatSalary(
            application.salaryMin,
            application.salaryMax,
            application.salaryCurrency,
          )}
        />
        <DetailItem
          label="Equity"
          value={application.equityOffered ? "Yes" : "No"}
        />
        <DetailItem
          label="Applied"
          value={formatAppliedDate(application.appliedDate)}
        />
        <DetailItem
          label="Deadline"
          value={formatAppliedDate(application.deadlineDate)}
        />
        <DetailItem
          label="Last activity"
          value={formatAppliedDate(application.updatedAt)}
        />
      </div>
    </DetailsCard>
  );
}
