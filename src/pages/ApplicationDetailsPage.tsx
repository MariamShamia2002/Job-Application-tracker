import { useState } from "react";
import { Link, useParams } from "react-router";
import type { ApplicationStatus } from "@/api/types";
import { getErrorMessage, isNotFound, isUnauthorized } from "@/api/errors";
import { CoverLetterCard, ResumeCard } from "@/features/applications/details/components/AttachmentCards";
import { ApplicationHero } from "@/features/applications/details/components/ApplicationHero";
import { DeleteApplicationDialog } from "@/features/applications/details/components/DeleteApplicationDialog";
import { InterviewRoundsCard } from "@/features/interviews/components/InterviewRoundsCard";
import { JobDescriptionCard } from "@/features/applications/details/components/JobDescriptionCard";
import { KeyDetailsCard } from "@/features/applications/details/components/KeyDetailsCard";
import { NotesCard } from "@/features/applications/details/components/NotesCard";
import { RecruiterCard } from "@/features/applications/details/components/RecruiterCard";
import { ErrorBanner } from "@/features/applications/components/ErrorBanner";
import { applicationCode } from "@/features/applications/details/display";
import { useApplication } from "@/features/applications/useApplication";
import {
  useArchiveApplication,
  useDeleteApplication,
} from "@/features/applications/useApplicationMutations";
import { useUpdateApplicationStatus } from "@/features/applications/useUpdateApplicationStatus";

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const { data, error, isPending, isError, refetch } = useApplication(id);
  const statusMutation = useUpdateApplicationStatus();
  const archiveMutation = useArchiveApplication(id ?? "");
  const deleteMutation = useDeleteApplication();
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!id) return null;

  if (isPending) {
    return <DetailsSkeleton />;
  }

  if (isError && isNotFound(error)) {
    return (
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium">Application not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          It may have been deleted, or the link is wrong.
        </p>
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
      <div className="mx-auto max-w-6xl">
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

  const application = data;
  const code = applicationCode(application.id);
  const showStatusError = Boolean(
    statusMutation.isError &&
      statusMutation.error &&
      !isUnauthorized(statusMutation.error),
  );
  const showArchiveError = Boolean(
    archiveMutation.isError &&
      archiveMutation.error &&
      !isUnauthorized(archiveMutation.error),
  );
  const showDeleteError = Boolean(
    deleteMutation.isError &&
      deleteMutation.error &&
      !isUnauthorized(deleteMutation.error),
  );

  function changeStatus(status: ApplicationStatus) {
    statusMutation.reset();
    statusMutation.mutate({ id: application.id, status });
  }

  return (
    <div className="mx-auto max-w-6xl">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link to="/applications" className="hover:text-foreground">
          Applications
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-foreground">{code}</span>
      </nav>

      <div className="mb-4 space-y-2">
        {showStatusError && (
          <ErrorBanner
            title="Status change didn’t save"
            description="Reverted to the last confirmed value. Nothing was lost."
            error={statusMutation.error}
            onRetry={() => {
              if (statusMutation.variables) {
                statusMutation.mutate(statusMutation.variables);
              }
            }}
            onDismiss={() => statusMutation.reset()}
          />
        )}
        {showArchiveError && (
          <ErrorBanner
            title={
              application.archived
                ? "Couldn’t restore application"
                : "Couldn’t archive application"
            }
            description={getErrorMessage(
              archiveMutation.error,
              "Please try again.",
            )}
            error={archiveMutation.error}
            onRetry={() => archiveMutation.mutate(!application.archived)}
            onDismiss={() => archiveMutation.reset()}
          />
        )}
        {showDeleteError && (
          <ErrorBanner
            title="Couldn’t delete application"
            description={getErrorMessage(
              deleteMutation.error,
              "Please try again.",
            )}
            error={deleteMutation.error}
            onRetry={() => deleteMutation.mutate(application.id)}
            onDismiss={() => deleteMutation.reset()}
          />
        )}
      </div>

      <ApplicationHero
        application={application}
        onStatusChange={changeStatus}
        onArchive={() => {
          archiveMutation.reset();
          archiveMutation.mutate(!application.archived);
        }}
        onDelete={() => setDeleteOpen(true)}
        isArchiving={archiveMutation.isPending}
        isDeleting={deleteMutation.isPending}
      />

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <div className="space-y-4">
          <KeyDetailsCard application={application} />
          <JobDescriptionCard application={application} />
          <InterviewRoundsCard applicationId={application.id} />
        </div>
        <div className="space-y-4">
          <RecruiterCard application={application} />
          <ResumeCard application={application} />
          <CoverLetterCard application={application} />
          <NotesCard application={application} />
        </div>
      </div>

      <DeleteApplicationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        company={application.company}
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.reset();
          deleteMutation.mutate(application.id);
        }}
      />
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 h-3 w-40 animate-pulse rounded bg-zinc-200" />
      <div className="h-24 animate-pulse rounded-xl border border-border bg-white" />
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="h-56 animate-pulse rounded-xl border border-border bg-white" />
        <div className="h-40 animate-pulse rounded-xl border border-border bg-white" />
      </div>
    </div>
  );
}
