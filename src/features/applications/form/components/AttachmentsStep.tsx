import { useId, useState, type DragEvent } from "react";
import { ArrowUp, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FORM_STEPS } from "../steps";
import { useApplicationForm } from "../useApplicationForm";
import {
  ATTACHMENT_ACCEPT,
  formatFileSize,
} from "../validation";
import { FormField } from "./FormField";

function FileDropZone({
  id,
  file,
  title,
  hint,
  onFile,
}: {
  id: string;
  file: File | null;
  title: string;
  hint: string;
  onFile: (file: File | null) => void;
}) {
  const [dragging, setDragging] = useState(false);

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  }

  if (file) {
    return (
      <div className="flex min-h-40 items-center justify-between rounded-xl border border-border bg-zinc-50 px-4 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm">
            <FileText className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onFile(null)}
          aria-label={`Remove ${file.name}`}
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-white hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-zinc-50 px-6 py-10 text-center",
        dragging ? "border-foreground bg-white" : "border-border",
      )}
    >
      <input
        id={id}
        type="file"
        accept={ATTACHMENT_ACCEPT}
        className="sr-only"
        onChange={(event) => {
          onFile(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
      <span className="flex size-8 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm">
        <ArrowUp className="size-4" />
      </span>
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </label>
  );
}

export function AttachmentsStep() {
  const { values, setField, fieldErrors } = useApplicationForm();
  const step = FORM_STEPS[4];
  const resumeId = useId();
  const coverLetterId = useId();

  return (
    <div>
      <h2 className="text-base font-semibold text-foreground">{step.heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <FormField label="Resume" error={fieldErrors.resumeFile}>
          <FileDropZone
            id={resumeId}
            file={values.resumeFile}
            title="Drop your resume here"
            hint="pdf, docx · max 5MB"
            onFile={(file) => setField("resumeFile", file)}
          />
        </FormField>
        <FormField label="Cover letter" error={fieldErrors.coverLetterFile}>
          <FileDropZone
            id={coverLetterId}
            file={values.coverLetterFile}
            title="Drop a cover letter"
            hint="optional"
            onFile={(file) => setField("coverLetterFile", file)}
          />
        </FormField>
      </div>
    </div>
  );
}
