import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SUGGESTED_TAGS } from "../../labels";
import { FORM_STEPS } from "../steps";
import { useApplicationForm } from "../hooks/useApplicationForm";
import { FormField } from "./FormField";

export function DescriptionStep() {
  const { values, setField } = useApplicationForm();
  const step = FORM_STEPS[3];

  function toggleTag(tag: string) {
    setField(
      "tags",
      values.tags.includes(tag)
        ? values.tags.filter((item) => item !== tag)
        : [...values.tags, tag],
    );
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-foreground">{step.heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

      <div className="mt-6 space-y-5">
        <FormField id="jobDescription" label="Job description">
          <Textarea
            id="jobDescription"
            value={values.jobDescription}
            onChange={(event) => setField("jobDescription", event.target.value)}
            placeholder="Paste the posting so you can compare it later."
            rows={8}
            className="min-h-36 rounded-lg border-border bg-white shadow-none"
          />
          <p className="mt-1.5 text-right text-xs text-muted-foreground">
            {values.jobDescription.length} chars
          </p>
        </FormField>

        <FormField label="Tags">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TAGS.map((tag) => {
              const selected = values.tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs",
                    selected
                      ? "bg-foreground text-background"
                      : "border border-border bg-white text-foreground",
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </FormField>

        <FormField id="notes" label="Notes">
          <Textarea
            id="notes"
            value={values.notes}
            onChange={(event) => setField("notes", event.target.value)}
            placeholder="Anything you want to remember before the next call."
            rows={4}
            className="min-h-24 rounded-lg border-border bg-white shadow-none"
          />
        </FormField>
      </div>
    </div>
  );
}
