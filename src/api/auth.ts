import { apiClient } from "./client";
import type { LoginResponse } from "./types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export function login(credentials: LoginCredentials) {
  return apiClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

