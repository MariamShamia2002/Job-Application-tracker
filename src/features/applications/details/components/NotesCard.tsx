import type { Application } from "@/api/types";
import { DetailsCard } from "./DetailsCard";

export function NotesCard({ application }: { application: Application }) {
  const notes = application.notes?.trim();
  const tags = application.tags ?? [];

  return (
    <DetailsCard title="Notes">
      {notes ? (
        <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
          {notes}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">No notes yet</p>
      )}

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </DetailsCard>
  );
}
