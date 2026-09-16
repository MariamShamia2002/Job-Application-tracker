import { apiClient } from "./client";
import type { LoginResponse, User } from "./types";

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

export function getMe(token: string) {
  return apiClient<User>("/api/auth/me", {
    method: "GET",
    token,
  });
}