import { useQuery } from "@tanstack/react-query";
import { getApplications } from "@/features/applications/api/applications";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { applicationKeys } from "../utils/queryKeys";

export function useActiveCount() {
  const { token } = useAuth();

  return useQuery({
    queryKey: applicationKeys.activeCount(),
    queryFn: () => getApplications(token!, { archived: false }),
    enabled: Boolean(token),
    select: (response) => response.meta.count,
  });
}
