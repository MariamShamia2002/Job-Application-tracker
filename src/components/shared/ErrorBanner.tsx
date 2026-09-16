import { CircleAlert, X } from "lucide-react";
import { isApiError } from "@/api/errors";
import { Button } from "@/components/ui/button";

export function ErrorBanner({
  title,
  description,
  error,
  onRetry,
  onDismiss,
}: {
  title: string;
  description: string;
  error: unknown;
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  const code = isApiError(error) ? error.status : null;

  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-xl border border-red-100 bg-[#fef2f2] px-4 py-3 text-red-800"
    >
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
        <CircleAlert className="size-3.5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-red-900">{title}</p>
        <p className="text-xs text-red-700/80">{description}</p>
      </div>

      {code !== null && (
        <span className="shrink-0 font-mono text-xs text-red-400">{code}</span>
      )}

      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="h-7 rounded-md border-red-200 bg-white px-3 text-xs text-red-800 shadow-none hover:bg-red-50"
        >
          Retry
        </Button>
      )}

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="inline-flex size-6 items-center justify-center rounded-md text-red-400 hover:bg-red-100 hover:text-red-700"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
