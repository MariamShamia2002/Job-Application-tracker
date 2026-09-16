import { Search } from "lucide-react";
import type { ApplicationSource, ApplicationStatus, Priority } from "@/api/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  SOURCE_LABELS,
  SOURCE_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "../labels";
import { useApplicationFilters } from "../useApplicationFilters";

const filterTriggerClass =
  "h-9 min-w-[140px] rounded-xl border-border bg-white px-3 shadow-none text-foreground";

const statusItems = {
  all: "All statuses",
  ...STATUS_LABELS,
};

const sourceItems = {
  all: "All sources",
  ...SOURCE_LABELS,
};

const priorityItems = {
  all: "Any priority",
  ...PRIORITY_LABELS,
};

export function ApplicationsToolbar() {
  const {
    search,
    status,
    source,
    priority,
    archived,
    setSearch,
    setStatus,
    setSource,
    setPriority,
    setArchived,
    clear,
  } = useApplicationFilters();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full max-w-[240px]">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search company or role"
          className="h-9 rounded-xl border-border bg-white pr-3 pl-9 shadow-none"
        />
      </div>

      <Select
        items={statusItems}
        value={status}
        onValueChange={(value) => {
          if (value) setStatus(value as ApplicationStatus | "all");
        }}
      >
        <SelectTrigger aria-label="Filter by status" className={filterTriggerClass}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {STATUS_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={sourceItems}
        value={source}
        onValueChange={(value) => {
          if (value) setSource(value as ApplicationSource | "all");
        }}
      >
        <SelectTrigger aria-label="Filter by source" className={filterTriggerClass}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          <SelectItem value="all">All sources</SelectItem>
          {SOURCE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {SOURCE_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={priorityItems}
        value={priority}
        onValueChange={(value) => {
          if (value) setPriority(value as Priority | "all");
        }}
      >
        <SelectTrigger aria-label="Filter by priority" className={filterTriggerClass}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          <SelectItem value="all">Any priority</SelectItem>
          {PRIORITY_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {PRIORITY_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2 px-1">
        <Switch
          checked={archived}
          onCheckedChange={setArchived}
          id="archived-filter"
        />
        <Label htmlFor="archived-filter" className="text-sm font-normal text-foreground">
          Archived
        </Label>
      </div>

      <button
        type="button"
        onClick={clear}
        className="text-sm text-foreground underline underline-offset-2 hover:text-foreground/80"
      >
        Clear
      </button>
    </div>
  );
}
