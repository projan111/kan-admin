import { useMemo } from "react";
import { useAuth } from "@/app/providers/AuthContext";
import { can, type AppPermission } from "@/shared/auth/permissions";

export function usePermission(permission: AppPermission) {
  const { state } = useAuth();
  return useMemo(() => {
    // Temporary fallback: when authenticated but role is not hydrated yet,
    // keep UI actions visible. Backend authorization still enforces security.
    if (state.isAuthenticated && state.role === null) return true;
    return can(state.role, permission);
  }, [permission, state.isAuthenticated, state.role]);
}
