import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EMPLOYMENT_TYPE_LABELS,
  PRIORITY_LABELS,
  SENIORITY_LABELS,
  SOURCE_LABELS,
  STATUS_LABELS,
  WORK_MODE_LABELS,
} from "../../labels";
import { FORM_STEPS, type FormStepId } from "../steps";
import { useApplicationForm } from "../hooks/useApplicationForm";
import { stepNeedsAttention } from "../validation";

function display(value: string | undefined, empty = "Not set") {
  return value?.trim() ? value : empty;
}

function ReviewSection({
  step,
  children,
}: {
  step: (typeof FORM_STEPS)[number];
  children: ReactNode;
}) {
  const { values, goToStep } = useApplicationForm();
  const needsAttention =
    step.id < 6 && stepNeedsAttention(values, step.id as FormStepId);

  return (
    <section className="rounded-xl border border-border px-4 py-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-[11px] text-background">
            {needsAttention ? step.id : <Check className="size-3" />}
          </span>
          <h3 className="text-sm font-medium text-foreground">{step.heading}</h3>
          {needsAttention && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
              needs attention
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => goToStep(step.id as FormStepId)}
          className="text-sm underline underline-offset-2"
        >
          Edit this step
        </button>
      </div>
      {children}
    </section>
  );
}

function ReviewItem({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-sm",
          emphasize ? "font-medium text-foreground" : "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function ReviewStep() {
  const { values } = useApplicationForm();
  const heading = FORM_STEPS[5];
  const salary =
    values.salaryMin || values.salaryMax
      ? `${values.salaryMin || "?"} – ${values.salaryMax || "?"}${values.salaryCurrency ? ` ${values.salaryCurrency}` : ""}`
      : "Not disclosed";

  return (
    <div>
      <h2 className="text-base font-semibold text-foreground">{heading.heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{heading.description}</p>

      <div className="mt-6 space-y-3">
        <ReviewSection step={FORM_STEPS[0]}>
          <div className="grid gap-4 md:grid-cols-3">
            <ReviewItem label="Company" value={display(values.company)} emphasize />
            <ReviewItem label="Website" value={display(values.companyWebsite, "—")} />
            <ReviewItem label="Role" value={display(values.role)} emphasize />
            <ReviewItem label="Department" value={display(values.department, "—")} />
            <ReviewItem
              label="Employment"
              value={EMPLOYMENT_TYPE_LABELS[values.employmentType]}
            />
            <ReviewItem
              label="Work mode"
              value={WORK_MODE_LABELS[values.workMode]}
              emphasize
            />
            {values.workMode !== "remote" && (
              <ReviewItem label="Location" value={display(values.location)} />
            )}
            <ReviewItem
              label="Seniority"
              value={
                values.seniorityLevel
                  ? SENIORITY_LABELS[values.seniorityLevel]
                  : "—"
              }
            />
          </div>
        </ReviewSection>

        <ReviewSection step={FORM_STEPS[1]}>
          <div className="grid gap-4 md:grid-cols-3">
            <ReviewItem
              label="Source"
              value={values.source ? SOURCE_LABELS[values.source] : "n/a"}
              emphasize
            />
            <ReviewItem label="Referral" value={display(values.referralName, "n/a")} />
            <ReviewItem
              label="Status"
              value={STATUS_LABELS[values.status]}
              emphasize
            />
            <ReviewItem label="Applied" value={display(values.appliedDate)} />
            <ReviewItem label="Deadline" value={display(values.deadlineDate, "—")} />
            <ReviewItem
              label="Recruiter"
              value={display(values.recruiterName || values.recruiterEmail, "—")}
            />
          </div>
        </ReviewSection>

        <ReviewSection step={FORM_STEPS[2]}>
          <div className="grid gap-4 md:grid-cols-3">
            <ReviewItem label="Salary range" value={salary} emphasize />
            <ReviewItem label="Equity" value={values.equityOffered ? "Yes" : "No"} />
            <ReviewItem
              label="Priority"
              value={PRIORITY_LABELS[values.priority]}
              emphasize
            />
          </div>
        </ReviewSection>

        <ReviewSection step={FORM_STEPS[3]}>
          <div className="grid gap-4 md:grid-cols-3">
            <ReviewItem
              label="Description"
              value={values.jobDescription.trim() ? "Added" : "Empty"}
            />
            <ReviewItem
              label="Tags"
              value={values.tags.length ? values.tags.join(", ") : "Empty"}
              emphasize={values.tags.length > 0}
            />
            <ReviewItem
              label="Notes"
              value={values.notes.trim() ? "Added" : "Empty"}
            />
          </div>
        </ReviewSection>

        <ReviewSection step={FORM_STEPS[4]}>
          <div className="grid gap-4 md:grid-cols-2">
            <ReviewItem
              label="Resume"
              value={values.resumeFile?.name ?? "Not uploaded"}
            />
            <ReviewItem
              label="Cover letter"
              value={values.coverLetterFile?.name ?? "Not uploaded"}
            />
          </div>
        </ReviewSection>
      </div>
    </div>
  );
}
