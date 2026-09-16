import type { ApplicationsFilters } from "@/api/types";

export const applicationKeys = {
  all: ["applications"] as const,
  lists: () => [...applicationKeys.all, "list"] as const,
  list: (filters: ApplicationsFilters) =>
    [...applicationKeys.lists(), filters] as const,
  activeCount: () => [...applicationKeys.all, "active-count"] as const,
};
