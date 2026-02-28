import React from "react";
import { Outlet } from "react-router-dom";

// Temporary no-auth mode: allow all dashboard routes without login.
export const ProtectedRoute: React.FC = () => {
  return <Outlet />;
};
