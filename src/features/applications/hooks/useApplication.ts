import { useQuery } from "@tanstack/react-query";
import { getApplication } from "@/api/applications";
import { isUnauthorized } from "@/api/errors";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { applicationKeys } from "../queryKeys";

export function useApplication(id: string | undefined) {
  const { token, logout } = useAuth();

  return useQuery({
    queryKey: applicationKeys.detail(id ?? ""),
    queryFn: async () => {
      try {
        return await getApplication(token!, id!);
      } catch (error) {
        if (isUnauthorized(error)) logout();
        throw error;
      }
    },
    enabled: Boolean(token && id),
  });
}
