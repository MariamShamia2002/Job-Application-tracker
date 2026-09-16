import { useState, type FormEvent, type ReactNode } from "react";
import type { CreateInterviewRoundInput, InterviewRoundType } from "@/api/types";
import { getErrorMessage } from "@/api/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { fromDateTimeLocal } from "../display";
import {
  INTERVIEW_ROUND_LABELS,
  INTERVIEW_ROUND_OPTIONS,
} from "../labels";

const formControlClass =
  "h-9 w-full rounded-lg border-border bg-white px-3 shadow-none";

const roundItems = { ...INTERVIEW_ROUND_LABELS };

const EMPTY_FORM = {
  roundType: "" as InterviewRoundType | "",
  scheduledDate: "",
  interviewerName: "",
  interviewerRole: "",
  notes: "",
};

function optionalText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function AddInterviewForm({
  onSubmit,
  onCancel,
  isPending,
  error,
}: {
  onSubmit: (data: CreateInterviewRoundInput) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: unknown;
}) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<{
    roundType?: string;
    scheduledDate?: string;
  }>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: { roundType?: string; scheduledDate?: string } = {};
    if (!values.roundType) nextErrors.roundType = "Required";
    if (!values.scheduledDate) nextErrors.scheduledDate = "Required";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !values.roundType) return;

    onSubmit({
      roundType: values.roundType,
      scheduledDate: fromDateTimeLocal(values.scheduledDate),
      interviewerName: optionalText(values.interviewerName),
      interviewerRole: optionalText(values.interviewerRole),
      notes: optionalText(values.notes),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-zinc-50 p-4"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Round type" error={fieldErrors.roundType}>
          <Select
            items={roundItems}
            value={values.roundType || null}
            onValueChange={(value) => {
              if (!value) return;
              setValues((current) => ({
                ...current,
                roundType: value as InterviewRoundType,
              }));
              setFieldErrors((current) => ({ ...current, roundType: undefined }));
            }}
          >
            <SelectTrigger
              className={cn(formControlClass, "w-full justify-between")}
            >
              <SelectValue placeholder="Select round" />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {INTERVIEW_ROUND_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {INTERVIEW_ROUND_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          id="scheduledDate"
          label="Scheduled"
          error={fieldErrors.scheduledDate}
        >
          <Input
            id="scheduledDate"
            type="datetime-local"
            value={values.scheduledDate}
            onChange={(event) => {
              setValues((current) => ({
                ...current,
                scheduledDate: event.target.value,
              }));
              setFieldErrors((current) => ({
                ...current,
                scheduledDate: undefined,
              }));
            }}
            className={formControlClass}
          />
        </Field>

        <Field id="interviewerName" label="Interviewer">
          <Input
            id="interviewerName"
            value={values.interviewerName}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                interviewerName: event.target.value,
              }))
            }
            placeholder="Name"
            className={formControlClass}
          />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field id="interviewerRole" label="Role">
          <Input
            id="interviewerRole"
            value={values.interviewerRole}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                interviewerRole: event.target.value,
              }))
            }
            placeholder="Title"
            className={formControlClass}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field id="interviewNotes" label="Notes">
            <Textarea
              id="interviewNotes"
              rows={2}
              value={values.notes}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              placeholder="Live coding."
              className="min-h-[38px] bg-white md:text-sm"
            />
          </Field>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-xs text-red-600">
          {getErrorMessage(error, "Couldn’t add this round.")}
        </p>
      ) : null}

      <div className="mt-4 flex items-center gap-2">
        <Button type="submit" disabled={isPending} className="h-9 rounded-lg px-4">
          {isPending ? "Saving..." : "Save round"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
          className="h-9 rounded-lg bg-white"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id?: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
