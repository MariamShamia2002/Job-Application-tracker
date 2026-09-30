import { apiClient } from "@/api/client";
import type { LoginCredentials, LoginResponse } from "@/features/auth/types/auth";

export function login(credentials: LoginCredentials) {
  return apiClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
