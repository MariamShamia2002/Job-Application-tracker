import type { EmploymentType, SeniorityLevel } from "@/api/types";
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
  EMPLOYMENT_TYPE_LABELS,
  EMPLOYMENT_TYPE_OPTIONS,
  SENIORITY_LABELS,
  SENIORITY_OPTIONS,
  WORK_MODE_LABELS,
  WORK_MODE_OPTIONS,
} from "../../labels";
import { FORM_STEPS } from "../steps";
import { useApplicationForm } from "../useApplicationForm";
import { FormField, formControlClass } from "./FormField";

const employmentItems = { ...EMPLOYMENT_TYPE_LABELS };
const seniorityItems = { none: "Select level", ...SENIORITY_LABELS };

export function CompanyRoleStep() {
  const { values, setField, fieldErrors } = useApplicationForm();
  const step = FORM_STEPS[0];

  return (
    <div>
      <h2 className="text-base font-semibold text-foreground">{step.heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

      <div className="mt-6 grid gap-x-6 gap-y-5 md:grid-cols-2">
        <FormField id="company" label="Company" required error={fieldErrors.company}>
          <Input
            id="company"
            value={values.company}
            onChange={(event) => setField("company", event.target.value)}
            placeholder="Acme Inc."
            className={formControlClass}
          />
        </FormField>

        <FormField
          id="companyWebsite"
          label="Company website"
          error={fieldErrors.companyWebsite}
        >
          <Input
            id="companyWebsite"
            value={values.companyWebsite}
            onChange={(event) => setField("companyWebsite", event.target.value)}
            placeholder="acme.com"
            className={formControlClass}
          />
        </FormField>

        <FormField id="role" label="Role" required error={fieldErrors.role}>
          <Input
            id="role"
            value={values.role}
            onChange={(event) => setField("role", event.target.value)}
            placeholder="Senior Product Designer"
            className={formControlClass}
          />
        </FormField>

        <FormField id="department" label="Department">
          <Input
            id="department"
            value={values.department}
            onChange={(event) => setField("department", event.target.value)}
            placeholder="Design"
            className={formControlClass}
          />
        </FormField>

        <FormField label="Employment type">
          <Select
            items={employmentItems}
            value={values.employmentType}
            onValueChange={(value) => {
              if (value) setField("employmentType", value as EmploymentType);
            }}
          >
            <SelectTrigger className={cn(formControlClass, "justify-between")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {EMPLOYMENT_TYPE_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Work mode">
          <div className="flex rounded-lg bg-zinc-100 p-1">
            {WORK_MODE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setField("workMode", option)}
                className={cn(
                  "h-8 flex-1 rounded-md text-sm",
                  values.workMode === option
                    ? "bg-white font-medium text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                {WORK_MODE_LABELS[option]}
              </button>
            ))}
          </div>
        </FormField>

        {values.workMode !== "remote" && (
          <FormField
            id="location"
            label="Location"
            required
            hint={
              values.workMode === "hybrid"
                ? "required for Hybrid roles"
                : "required for On-site roles"
            }
            error={fieldErrors.location}
          >
            <Input
              id="location"
              value={values.location}
              onChange={(event) => setField("location", event.target.value)}
              placeholder="Berlin, DE"
              className={formControlClass}
            />
          </FormField>
        )}

        <FormField label="Seniority">
          <Select
            items={seniorityItems}
            value={values.seniorityLevel || "none"}
            onValueChange={(value) => {
              if (!value) return;
              setField(
                "seniorityLevel",
                value === "none" ? "" : (value as SeniorityLevel),
              );
            }}
          >
            <SelectTrigger className={cn(formControlClass, "justify-between")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              <SelectItem value="none">Select level</SelectItem>
              {SENIORITY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {SENIORITY_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </div>
  );
}
