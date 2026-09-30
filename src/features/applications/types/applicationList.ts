import type {
  ApplicationSource,
  ApplicationsFilters,
  ApplicationStatus,
  Priority,
} from "./application";

export type SortField = "company" | "status" | "appliedDate" | "priority";
export type SortDir = "asc" | "desc";

export interface ApplicationListContextValue {
  search: string;
  status: ApplicationStatus | "all";
  source: ApplicationSource | "all";
  priority: Priority | "all";
  archived: boolean;
  sortField: SortField | null;
  sortDir: SortDir;
  apiFilters: ApplicationsFilters;
  setSearch: (value: string) => void;
  setStatus: (value: ApplicationStatus | "all") => void;
  setSource: (value: ApplicationSource | "all") => void;
  setPriority: (value: Priority | "all") => void;
  setArchived: (value: boolean) => void;
  toggleSort: (field: SortField) => void;
  clear: () => void;
}
