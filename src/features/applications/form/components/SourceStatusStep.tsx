import type { ApplicationSource, ApplicationStatus } from "@/api/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  SOURCE_LABELS,
  SOURCE_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "../../labels";
import { FORM_STEPS } from "../steps";
import { useApplicationForm } from "../hooks/useApplicationForm";
import { FormField, formControlClass } from "./FormField";

const sourceItems = { none: "Select source", ...SOURCE_LABELS };
const statusItems = { ...STATUS_LABELS };

export function SourceStatusStep() {
  const { values, setField, fieldErrors } = useApplicationForm();
  const step = FORM_STEPS[1];

  return (
    <div>
      <h2 className="text-base font-semibold text-foreground">{step.heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

      <div className="mt-6 grid gap-x-6 gap-y-5 md:grid-cols-2">
        <FormField label="Source">
          <Select
            items={sourceItems}
            value={values.source || "none"}
            onValueChange={(value) => {
              if (!value) return;
              setField("source", value === "none" ? "" : (value as ApplicationSource));
            }}
          >
            <SelectTrigger className={cn(formControlClass, "justify-between")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              <SelectItem value="none">Select source</SelectItem>
              {SOURCE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {SOURCE_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Status">
          <Select
            items={statusItems}
            value={values.status}
            onValueChange={(value) => {
              if (value) setField("status", value as ApplicationStatus);
            }}
          >
            <SelectTrigger className={cn(formControlClass, "justify-between")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {STATUS_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          id="appliedDate"
          label="Applied date"
          required={values.status !== "saved"}
          error={fieldErrors.appliedDate}
        >
          <Input
            id="appliedDate"
            type="date"
            value={values.appliedDate}
            onChange={(event) => setField("appliedDate", event.target.value)}
            className={formControlClass}
          />
        </FormField>

        <FormField
          id="deadlineDate"
          label="Deadline"
          hint="optional"
          error={fieldErrors.deadlineDate}
        >
          <Input
            id="deadlineDate"
            type="date"
            value={values.deadlineDate}
            onChange={(event) => setField("deadlineDate", event.target.value)}
            className={formControlClass}
          />
        </FormField>

        {values.source === "referral" && (
          <FormField
            id="referralName"
            label="Referral"
            required
            error={fieldErrors.referralName}
          >
            <Input
              id="referralName"
              value={values.referralName}
              onChange={(event) => setField("referralName", event.target.value)}
              placeholder="Who referred you"
              className={formControlClass}
            />
          </FormField>
        )}

        <FormField
          id="recruiterContact"
          label="Recruiter contact"
          error={fieldErrors.recruiterEmail}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              id="recruiterName"
              value={values.recruiterName}
              onChange={(event) => setField("recruiterName", event.target.value)}
              placeholder="Name"
              className={formControlClass}
            />
            <Input
              id="recruiterEmail"
              type="email"
              value={values.recruiterEmail}
              onChange={(event) => setField("recruiterEmail", event.target.value)}
              placeholder="email"
              className={formControlClass}
            />
          </div>
        </FormField>
      </div>
    </div>
  );
}
