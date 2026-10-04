import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getApplications } from "@/features/applications/api/applications";
import type { ApplicationsFilters } from "@/features/applications/types/application";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { applicationKeys } from "../utils/queryKeys";

export function useApplications(filters: ApplicationsFilters) {
  const { token } = useAuth();

  return useQuery({
    queryKey: applicationKeys.list(filters),
    queryFn: () => getApplications(token!, filters),
    enabled: Boolean(token),
    placeholderData: keepPreviousData,
  });
}
