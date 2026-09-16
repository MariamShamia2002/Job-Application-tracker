import { useQuery } from "@tanstack/react-query";
import { getApplications } from "@/api/applications";
import { useAuth } from "@/features/auth/useAuth";
import { applicationKeys } from "./queryKeys";

export function useActiveCount() {
  const { token } = useAuth();

  return useQuery({
    queryKey: applicationKeys.activeCount(),
    queryFn: () => getApplications(token!, { archived: false }),
    enabled: Boolean(token),
    select: (response) => response.meta.count,
  });
}
