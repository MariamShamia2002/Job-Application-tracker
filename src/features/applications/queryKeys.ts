import type { ApplicationsFilters } from "@/api/types";

export const applicationKeys = {
  all: ["applications"] as const,
  lists: () => [...applicationKeys.all, "list"] as const,
  list: (filters: ApplicationsFilters) =>
    [...applicationKeys.lists(), filters] as const,
  activeCount: () => [...applicationKeys.all, "active-count"] as const,
  details: () => [...applicationKeys.all, "detail"] as const,
  detail: (id: string) => [...applicationKeys.details(), id] as const,
  interviews: (id: string) =>
    [...applicationKeys.detail(id), "interviews"] as const,
};
