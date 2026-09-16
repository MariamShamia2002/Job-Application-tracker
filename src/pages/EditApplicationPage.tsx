import { Link, useParams } from "react-router";
import { getErrorMessage, isNotFound, isUnauthorized } from "@/api/errors";
import { ErrorBanner } from "@/components/shared/ErrorBanner";
import { ApplicationForm } from "@/features/applications/form/components/ApplicationForm";
import { ApplicationFormProvider } from "@/features/applications/form/ApplicationFormProvider";
import { toFormValues } from "@/features/applications/form/toFormValues";
import { useApplication } from "@/features/applications/hooks/useApplication";

export default function EditApplicationPage() {
  const { id } = useParams();
  const { data, error, isPending, isError, refetch } = useApplication(id);

  if (!id) return null;

  if (isPending) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="h-8 w-48 animate-pulse rounded bg-zinc-200" />
        <div className="mt-6 h-96 animate-pulse rounded-2xl border border-border bg-white" />
      </div>
    );
  }

  if (isError && isNotFound(error)) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium">Application not found</p>
        <Link
          to="/applications"
          className="mt-4 inline-block text-sm underline underline-offset-2"
        >
          Back to applications
        </Link>
      </div>
    );
  }

  if (isError && error && !isUnauthorized(error)) {
    return (
      <div className="mx-auto max-w-5xl">
        <ErrorBanner
          title="Couldn’t load application"
          description={getErrorMessage(error, "Please try again.")}
          error={error}
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
    );
  }

  if (!data) return null;

  return (
    <ApplicationFormProvider initialValues={toFormValues(data)}>
      <ApplicationForm mode="edit" />
    </ApplicationFormProvider>
  );
}
