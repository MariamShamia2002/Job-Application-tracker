import { useState } from "react";
import type { Application } from "@/api/types";
import { DetailsCard } from "./DetailsCard";

export function JobDescriptionCard({
  application,
}: {
  application: Application;
}) {
  const [expanded, setExpanded] = useState(false);
  const description = application.jobDescription?.trim();
  const canExpand = Boolean(description && description.length > 280);

  return (
    <DetailsCard
      title="Job description"
      action={
        canExpand ? (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        ) : null
      }
    >
      {description ? (
        <p
          className={
            expanded || !canExpand
              ? "whitespace-pre-wrap text-sm leading-6 text-muted-foreground"
              : "line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground"
          }
        >
          {description}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">No job description yet</p>
      )}
    </DetailsCard>
  );
}
