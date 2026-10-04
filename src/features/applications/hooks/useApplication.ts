import { useQuery } from "@tanstack/react-query";
import { getApplication } from "@/features/applications/api/applications";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { applicationKeys } from "../utils/queryKeys";

export function useApplication(id: string | undefined) {
  const { token } = useAuth();

  return useQuery({
    queryKey: applicationKeys.detail(id ?? ""),
    queryFn: () => getApplication(token!, id!),
    enabled: Boolean(token && id),
  });
}
