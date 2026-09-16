import { createContext } from "react";
import type {
  ApplicationSource,
  ApplicationsFilters,
  ApplicationStatus,
  Priority,
} from "@/api/types";

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

export const ApplicationListContext =
  createContext<ApplicationListContextValue | null>(null);
