import type { Application } from "@/api/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "../../labels";
import { DetailsCard } from "./DetailsCard";

export function RecruiterCard({ application }: { application: Application }) {
  const name = application.recruiterName?.trim();

  return (
    <DetailsCard title="Recruiter contact">
      {!name &&
      !application.recruiterEmail &&
      !application.recruiterPhone &&
      !application.recruiterTitle ? (
        <p className="text-sm text-muted-foreground">No recruiter added</p>
      ) : (
        <div className="flex items-start gap-3">
          <Avatar className="size-10 bg-zinc-100">
            <AvatarFallback className="bg-zinc-100 text-xs font-medium text-zinc-600">
              {getInitials(name || application.recruiterEmail || "?")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              {name || "—"}
            </p>
            {application.recruiterTitle && (
              <p className="text-xs text-muted-foreground">
                {application.recruiterTitle}
              </p>
            )}
            {application.recruiterEmail && (
              <a
                href={`mailto:${application.recruiterEmail}`}
                className="mt-1 block truncate text-sm text-muted-foreground hover:text-foreground"
              >
                {application.recruiterEmail}
              </a>
            )}
            {application.recruiterPhone && (
              <a
                href={`tel:${application.recruiterPhone}`}
                className="mt-0.5 block text-sm text-muted-foreground hover:text-foreground"
              >
                {application.recruiterPhone}
              </a>
            )}
          </div>
        </div>
      )}
    </DetailsCard>
  );
}
