export const ATTACHMENT_ACCEPT =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024;

function isAllowedAttachment(file: File) {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".pdf") ||
    name.endsWith(".docx") ||
    file.type === "application/pdf" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
}

export function validateAttachment(file: File | null) {
  if (!file) return;
  if (file.size > ATTACHMENT_MAX_BYTES) return "Must be 5MB or smaller";
  if (!isAllowedAttachment(file)) return "Must be a PDF or DOCX file";
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
