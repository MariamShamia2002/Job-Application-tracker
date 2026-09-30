import type { ApplicationsFilters } from "@/features/applications/types/application";

export const applicationKeys = {
  all: ["applications"] as const,
  lists: () => [...applicationKeys.all, "list"] as const,
  list: (filters: ApplicationsFilters) =>
    [...applicationKeys.lists(), filters] as const,
  activeCount: () => [...applicationKeys.all, "active-count"] as const,
  details: () => [...applicationKeys.all, "detail"] as const,
  detail: (id: string) => [...applicationKeys.details(), id] as const,
};
