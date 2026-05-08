import React from "react";
import { statusColors } from "@/shared/styles/dashboardTheme";

type StatusVariant = keyof typeof statusColors;

type Props = {
  status: string;
  variant?: StatusVariant;
};

export const StatusBadge: React.FC<Props> = ({ status, variant }) => {
  // Auto-detect variant from status if not provided
  const detectedVariant: StatusVariant =
    variant ||
    (status.toLowerCase().replace(/\s+/g, "") as StatusVariant) ||
    "inactive";

  const colorClass = statusColors[detectedVariant] || statusColors.inactive;

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${colorClass}`}
    >
      {status}
    </span>
  );
};
