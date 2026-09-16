import type { ApplicationStatus } from "@/api/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { STATUS_LABELS, STATUS_OPTIONS } from "../labels";
import { StatusBadge } from "./StatusBadge";

export function StatusMenu({
  status,
  onChange,
}: {
  status: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      <StatusBadge status={status} />
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Change status"
          className="inline-flex size-5 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
        >
          <ChevronDown className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={6} className="min-w-44 w-auto">
          <DropdownMenuRadioGroup
            value={status}
            onValueChange={(value) => {
              if (value && value !== status) {
                onChange(value as ApplicationStatus);
              }
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuRadioItem key={option} value={option}>
                {STATUS_LABELS[option]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
