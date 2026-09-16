import type { Priority, SalaryCurrency } from "@/api/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  CURRENCY_LABELS,
  CURRENCY_OPTIONS,
  PRIORITY_DOT_CLASS,
  PRIORITY_HINTS,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
} from "../../labels";
import { FORM_STEPS } from "../steps";
import { useApplicationForm } from "../useApplicationForm";
import { FormField, formControlClass } from "./FormField";

const currencyItems = { ...CURRENCY_LABELS };

export function CompensationStep() {
  const { values, setField, fieldErrors } = useApplicationForm();
  const step = FORM_STEPS[2];

  return (
    <div>
      <h2 className="text-base font-semibold text-foreground">{step.heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

      <div className="mt-6 grid gap-x-6 gap-y-5 md:grid-cols-3">
        <FormField id="salaryMin" label="Salary min" error={fieldErrors.salaryMin}>
          <Input
            id="salaryMin"
            type="number"
            value={values.salaryMin}
            onChange={(event) => setField("salaryMin", event.target.value)}
            placeholder="120000"
            className={formControlClass}
          />
        </FormField>

        <FormField id="salaryMax" label="Salary max" error={fieldErrors.salaryMax}>
          <Input
            id="salaryMax"
            type="number"
            value={values.salaryMax}
            onChange={(event) => setField("salaryMax", event.target.value)}
            placeholder="150000"
            className={formControlClass}
          />
        </FormField>

        <FormField label="Currency">
          <Select
            items={currencyItems}
            value={values.salaryCurrency}
            onValueChange={(value) => {
              if (value) setField("salaryCurrency", value as SalaryCurrency);
            }}
          >
            <SelectTrigger className={cn(formControlClass, "justify-between")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {CURRENCY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {CURRENCY_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-border px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">Equity offered</p>
          <p className="text-sm text-muted-foreground">
            Track RSUs or options as part of the package.
          </p>
        </div>
        <Switch
          id="equityOffered"
          checked={values.equityOffered}
          onCheckedChange={(checked) => setField("equityOffered", checked)}
        />
      </div>

      <FormField label="Priority">
        <div className="mt-1 grid gap-3 md:grid-cols-3">
          {PRIORITY_OPTIONS.map((option) => {
            const selected = values.priority === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setField("priority", option as Priority)}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3 text-left",
                  selected ? "border-foreground" : "border-border",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className={cn("size-2 rounded-full", PRIORITY_DOT_CLASS[option])} />
                  {PRIORITY_LABELS[option]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {PRIORITY_HINTS[option]}
                </span>
              </button>
            );
          })}
        </div>
      </FormField>
    </div>
  );
}
