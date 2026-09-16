export function ViewToggle() {
  return (
    <div className="inline-flex items-center rounded-lg bg-zinc-200/80 p-0.5">
      <span className="rounded-md bg-white px-3 py-1 text-xs font-medium text-foreground shadow-sm">
        Table
      </span>
      <span className="cursor-default px-3 py-1 text-xs font-medium text-muted-foreground">
        Kanban
      </span>
    </div>
  );
}
