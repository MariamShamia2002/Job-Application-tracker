import type { FormEvent } from "react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { getErrorMessage } from "@/api/errors";
import { ErrorBanner } from "../../components/ErrorBanner";
import { cn } from "@/lib/utils";
import { CONTENT_STEP_COUNT, LAST_STEP } from "../steps";
import { useApplicationForm } from "../useApplicationForm";
import { useCreateApplication } from "../useCreateApplication";
import { AttachmentsStep } from "./AttachmentsStep";
import { CompanyRoleStep } from "./CompanyRoleStep";
import { CompensationStep } from "./CompensationStep";
import { DescriptionStep } from "./DescriptionStep";
import { FormStepper } from "./FormStepper";
import { ReviewStep } from "./ReviewStep";
import { SourceStatusStep } from "./SourceStatusStep";

const STEP_VIEWS = {
  1: CompanyRoleStep,
  2: SourceStatusStep,
  3: CompensationStep,
  4: DescriptionStep,
  5: AttachmentsStep,
  6: ReviewStep,
} as const;

export function ApplicationForm() {
  const { step, goNext, goBack } = useApplicationForm();
  const create = useCreateApplication();
  const StepView = STEP_VIEWS[step];
  const isReview = step === LAST_STEP;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isReview) {
      create.submit();
      return;
    }
    goNext();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">New application</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Five steps, then a review. Nothing is submitted until you confirm.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            draft saved
          </span>
          <Link
            to="/applications"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 rounded-lg bg-white",
            )}
          >
            Cancel
          </Link>
        </div>
      </div>

      <FormStepper />

      <form
        noValidate
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-white p-6 md:p-8"
      >
        <StepView />

        {create.isError && (
          <div className="mt-6">
            <ErrorBanner
              title="Couldn’t save application"
              description={getErrorMessage(
                create.error,
                "Check the highlighted fields and try again.",
              )}
              error={create.error}
              onRetry={() => create.submit()}
              onDismiss={() => create.reset()}
            />
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={step === 1}
            className="h-9 rounded-lg bg-white"
          >
            Back
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {isReview ? "review" : `step ${step} of ${CONTENT_STEP_COUNT}`}
            </span>
            {isReview ? (
              <Button
                type="submit"
                disabled={create.isPending}
                className="h-9 rounded-lg px-4"
              >
                {create.isPending ? "Saving..." : "Save application"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                className="h-9 rounded-lg px-4"
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
