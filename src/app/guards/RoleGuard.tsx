import React from "react";
import { Outlet } from "react-router-dom";
import type { Role } from "../../features/auth";

type Props = Readonly<{
  allow: ReadonlyArray<Role>;
  redirectTo?: string;
}>;

// Temporary no-auth mode: bypass role checks.
export const RoleGuard: React.FC<Props> = () => {
  return <Outlet />;
};
