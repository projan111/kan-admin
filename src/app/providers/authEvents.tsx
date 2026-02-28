import type { QueryClient } from "@tanstack/react-query";

type LogoutHandler = Readonly<{
  clearAuth: () => void;
  queryClient: QueryClient;
  navigateToLogin: () => void;
}>;

let handler: LogoutHandler | null = null;

export function registerLogoutHandler(next: LogoutHandler): void {
  handler = next;
}

export function triggerGlobalLogout(): void {
  if (!handler) return;
  handler.queryClient.clear();
  handler.clearAuth();
  handler.navigateToLogin();
}