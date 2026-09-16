import { useRef, useState } from "react";
import type { Application } from "@/api/types";
import { getErrorMessage, isUnauthorized } from "@/api/errors";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ErrorBanner } from "../../components/ErrorBanner";
import { ATTACHMENT_ACCEPT } from "../../form/validation";
import { useApplicationAttachments } from "../../useApplicationAttachments";
import { fileExtension, triggerDownload } from "../display";
import { DetailsCard } from "./DetailsCard";

export function ResumeCard({ application }: { application: Application }) {
  return (
    <FileCard
      application={application}
      kind="resume"
      title="Resume"
      emptyTitle="No resume yet"
      emptyHint="click to upload"
    />
  );
}

export function CoverLetterCard({ application }: { application: Application }) {
  return (
    <FileCard
      application={application}
      kind="coverLetter"
      title="Cover letter"
      emptyTitle="No cover letter yet"
      emptyHint="click to upload"
    />
  );
}

function FileCard({
  application,
  kind,
  title,
  emptyTitle,
  emptyHint,
}: {
  application: Application;
  kind: "resume" | "coverLetter";
  title: string;
  emptyTitle: string;
  emptyHint: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [downloadError, setDownloadError] = useState<unknown>(null);
  const attachments = useApplicationAttachments(application.id);

  const hasFile =
    kind === "resume" ? application.hasResume : application.hasCoverLetter;
  const fileName =
    kind === "resume"
      ? application.resumeFileName
      : application.coverLetterFileName;
  const upload =
    kind === "resume" ? attachments.uploadResume : attachments.uploadCoverLetter;
  const remove =
    kind === "resume" ? attachments.deleteResume : attachments.deleteCoverLetter;
  const download =
    kind === "resume"
      ? attachments.downloadResume
      : attachments.downloadCoverLetter;

  const mutationError = upload.error ?? remove.error ?? downloadError;
  const busy = upload.isPending || remove.isPending;

  function pickFile() {
    inputRef.current?.click();
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    setDownloadError(null);
    upload.reset();
    remove.reset();
    upload.mutate(file);
  }

  async function onDownload() {
    setDownloadError(null);
    try {
      const blob = await download();
      triggerDownload(blob, fileName || `${kind}.pdf`);
    } catch (error) {
      setDownloadError(error);
    }
  }

  return (
    <DetailsCard title={title}>
      <input
        ref={inputRef}
        type="file"
        accept={ATTACHMENT_ACCEPT}
        className="sr-only"
        onChange={(event) => {
          onFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {mutationError != null && !isUnauthorized(mutationError) ? (
        <div className="mb-3">
          <ErrorBanner
            title={
              downloadError
                ? "Couldn’t download file"
                : upload.error
                  ? "Couldn’t upload file"
                  : "Couldn’t remove file"
            }
            description={getErrorMessage(
              mutationError,
              "Please try again.",
            )}
            error={mutationError}
            onRetry={() => {
              if (downloadError) {
                void onDownload();
                return;
              }
              if (upload.error && upload.variables) {
                upload.mutate(upload.variables);
                return;
              }
              if (remove.error) remove.mutate();
            }}
            onDismiss={() => {
              setDownloadError(null);
              upload.reset();
              remove.reset();
            }}
          />
        </div>
      ) : null}

      {hasFile ? (
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-zinc-50 text-[9px] font-semibold tracking-wide text-muted-foreground">
              <FileText className="mb-0.5 size-3.5" />
              {fileExtension(fileName)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {fileName || "Uploaded file"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-lg bg-white"
              onClick={() => void onDownload()}
              disabled={busy}
            >
              Download
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-lg bg-white"
              onClick={pickFile}
              disabled={busy}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-lg border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                setDownloadError(null);
                upload.reset();
                remove.mutate();
              }}
              disabled={busy}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={pickFile}
          disabled={busy}
          className="flex min-h-24 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-zinc-50 px-4 py-6 text-center hover:bg-white"
        >
          <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{emptyHint}</p>
        </button>
      )}
    </DetailsCard>
  );
}
