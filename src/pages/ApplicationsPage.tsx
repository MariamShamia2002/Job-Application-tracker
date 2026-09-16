import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getApplications } from "@/api/applications";
import { getErrorMessage, isUnauthorized } from "@/api/errors";
import { ApplicationProvider } from "@/features/applications/ApplicationProvider";
import { ApplicationsToolbar } from "@/features/applications/components/ApplicationsToolbar";
import {
  ApplicationsEmpty,
  ApplicationsTable,
  ApplicationsTableSkeleton,
} from "@/features/applications/components/ApplicationsTable";
import { ErrorBanner } from "@/components/shared/ErrorBanner";
import { ViewToggle } from "@/features/applications/components/ViewToggle";
import { applicationKeys } from "@/features/applications/queryKeys";
import { useApplicationFilters } from "@/features/applications/hooks/useApplicationFilters";
import { useUpdateApplicationStatus } from "@/features/applications/hooks/useUpdateApplicationStatus";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function ApplicationsPage() {
  return (
    <ApplicationProvider>
      <ApplicationsList />
    </ApplicationProvider>
  );
}

function ApplicationsList() {
  const { token, logout } = useAuth();
  const { apiFilters, clear } = useApplicationFilters();
  const statusMutation = useUpdateApplicationStatus();

  const { data, error, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: applicationKeys.list(apiFilters),
    queryFn: () => getApplications(token!, apiFilters),
    enabled: Boolean(token),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (error && isUnauthorized(error)) {
      logout();
    }
  }, [error, logout]);

  const applications = data?.data ?? [];
  const hasFilters = Boolean(
    apiFilters.search ||
      apiFilters.status ||
      apiFilters.source ||
      apiFilters.priority ||
      apiFilters.archived ||
      apiFilters.sort,
  );
  const showQueryError = isError && error && !isUnauthorized(error);
  const showStatusError =
    statusMutation.isError &&
    statusMutation.error &&
    !isUnauthorized(statusMutation.error);

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Applications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every role you’re chasing, and where it stands.
          </p>
        </div>
        <ViewToggle />
      </div>

      <div className="mb-4">
        <ApplicationsToolbar />
      </div>

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

        {showQueryError && (
          <ErrorBanner
            title="Couldn’t load applications"
            description={getErrorMessage(
              error,
              "Something went wrong. Please try again.",
            )}
            error={error}
            onRetry={() => {
              void refetch();
            }}
          />
        )}
      </div>

      {isPending ? (
        <ApplicationsTableSkeleton />
      ) : showQueryError ? null : applications.length === 0 ? (
        <ApplicationsEmpty hasFilters={hasFilters} onClear={clear} />
      ) : (
        <div className={isFetching ? "opacity-80 transition-opacity" : undefined}>
          <ApplicationsTable
            applications={applications}
            onStatusChange={(id, status) => {
              statusMutation.reset();
              statusMutation.mutate({ id, status });
            }}
          />
        </div>
      )}
    </div>
  );
}
