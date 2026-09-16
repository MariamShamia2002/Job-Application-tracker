import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FORM_STEPS, type FormStepId } from "../steps";
import { useApplicationForm } from "../useApplicationForm";

export function FormStepper() {
  const { step, goToStep } = useApplicationForm();

  return (
    <nav
      aria-label="Application form steps"
      className="mb-5 rounded-xl border border-border bg-white px-4 py-3"
    >
      <ol className="flex items-center">
        {FORM_STEPS.map((item, index) => {
          const active = step === item.id;
          const complete = step > item.id;
          const locked = item.id > step;

          return (
            <li key={item.id} className="flex min-w-0 flex-1 items-center">
              <button
                type="button"
                onClick={() => goToStep(item.id as FormStepId)}
                disabled={locked}
                className={cn(
                  "flex shrink-0 items-center gap-2",
                  locked && "cursor-not-allowed",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium",
                    active && "bg-foreground text-background",
                    complete && "bg-foreground text-background",
                    !active && !complete && "border border-border text-muted-foreground",
                  )}
                >
                  {complete ? <Check className="size-3" /> : item.id}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-sm",
                    active ? "font-medium text-foreground" : "text-muted-foreground",
                    locked && "opacity-60",
                  )}
                >
                  {item.title}
                </span>
              </button>
              {index < FORM_STEPS.length - 1 && (
                <span className="mx-3 h-px min-w-3 flex-1 bg-border" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
