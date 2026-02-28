import React from "react";
import { Outlet } from "react-router-dom";

type Props = Readonly<{
  permission: string;
  redirectTo?: string;
}>;

// Temporary no-auth mode: bypass permission checks.
export const PermissionGuard: React.FC<Props> = () => {
  return <Outlet />;
};
