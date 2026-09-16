import { useMemo, useState } from "react";
import type { InterviewOutcome, InterviewRound } from "@/api/types";
import { getErrorMessage, isUnauthorized } from "@/api/errors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ErrorBanner } from "@/features/applications/components/ErrorBanner";
import { DetailsCard } from "@/features/applications/details/components/DetailsCard";
import { formatDateTime } from "../display";
import {
  INTERVIEW_OUTCOME_CLASS,
  INTERVIEW_OUTCOME_LABELS,
  INTERVIEW_ROUND_LABELS,
} from "../labels";
import {
  useCreateInterviewRound,
  useInterviewRounds,
} from "../useInterviewRounds";
import { AddInterviewForm } from "./AddInterviewForm";

export function InterviewRoundsCard({
  applicationId,
}: {
  applicationId: string;
}) {
  const [adding, setAdding] = useState(false);
  const roundsQuery = useInterviewRounds(applicationId);
  const createRound = useCreateInterviewRound(applicationId);

  const rounds = useMemo(() => {
    const list = roundsQuery.data ?? [];
    return [...list].sort((a, b) =>
      a.scheduledDate.localeCompare(b.scheduledDate),
    );
  }, [roundsQuery.data]);

  const showQueryError = Boolean(
    roundsQuery.isError &&
      roundsQuery.error &&
      !isUnauthorized(roundsQuery.error),
  );

  return (
    <DetailsCard
      title="Interview rounds"
      className="p-5"
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-lg border-border bg-white shadow-none"
          onClick={() => setAdding(true)}
        >
          Add Interview Round
        </Button>
      }
    >
      {showQueryError && (
        <div className="mb-3">
          <ErrorBanner
            title="Couldn’t load interview rounds"
            description={getErrorMessage(
              roundsQuery.error,
              "Please try again.",
            )}
            error={roundsQuery.error}
            onRetry={() => {
              void roundsQuery.refetch();
            }}
          />
        </div>
      )}

      {roundsQuery.isPending ? (
        <div className="space-y-3">
          <div className="h-12 animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-12 animate-pulse rounded-lg bg-zinc-100" />
        </div>
      ) : rounds.length === 0 && !showQueryError && !adding ? (
        <p className="text-sm text-muted-foreground">No interview rounds yet</p>
      ) : rounds.length > 0 ? (
        <ol>
          {rounds.map((round) => (
            <InterviewRoundItem key={round.id} round={round} />
          ))}
        </ol>
      ) : null}

      {adding && (
        <div className={rounds.length > 0 ? "mt-5" : undefined}>
          <AddInterviewForm
            isPending={createRound.isPending}
            error={createRound.error}
            onCancel={() => {
              createRound.reset();
              setAdding(false);
            }}
            onSubmit={(data) => {
              createRound.mutate(data, {
                onSuccess: () => {
                  createRound.reset();
                  setAdding(false);
                },
              });
            }}
          />
        </div>
      )}
    </DetailsCard>
  );
}

function InterviewRoundItem({ round }: { round: InterviewRound }) {
  return (
    <li className="group relative pb-5 pl-10 last:pb-0">
      <span
        aria-hidden
        className={cn(
          "absolute top-0.5 left-1.5 box-border size-3 rounded-full border-[3px] bg-white",
          outcomeDotClass(round.outcome),
        )}
      />
      <span
        aria-hidden
        className="absolute top-[18px] bottom-4 left-3 w-px -translate-x-1/2 bg-zinc-200 group-last:hidden"
      />

      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <p className="text-sm font-semibold text-foreground">
          {INTERVIEW_ROUND_LABELS[round.roundType]}
        </p>
        <span
          className={cn(
            "inline-flex h-[22px] items-center rounded-full px-2 text-[11px] font-medium",
            INTERVIEW_OUTCOME_CLASS[round.outcome],
          )}
        >
          {INTERVIEW_OUTCOME_LABELS[round.outcome]}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {formatDateTime(round.scheduledDate)}
        </span>
      </div>

      {(round.interviewerName || round.interviewerRole) && (
        <p className="mt-0.5 text-sm text-muted-foreground">
          {[round.interviewerName, round.interviewerRole]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}

      {round.notes && (
        <p className="mt-2 rounded-xl bg-zinc-50 px-3.5 py-3 text-sm leading-5 text-muted-foreground">
          {round.notes}
        </p>
      )}
    </li>
  );
}

function outcomeDotClass(outcome: InterviewOutcome) {
  switch (outcome) {
    case "passed":
      return "border-emerald-500";
    case "pending":
      return "border-blue-500";
    case "failed":
      return "border-red-500";
    case "cancelled":
      return "border-zinc-400";
  }
}
