export function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function fileExtension(fileName: string | null) {
  if (!fileName) return "FILE";
  const ext = fileName.split(".").pop()?.trim();
  return ext ? ext.toUpperCase() : "FILE";
}
