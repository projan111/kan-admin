import React from "react";
import type { LucideIcon } from "lucide-react";
import { statCardColors } from "@/shared/styles/dashboardTheme";

type ColorVariant = keyof typeof statCardColors;

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorVariant?: ColorVariant;
  subtitle?: string;
};

export const StatCardV2: React.FC<Props> = ({
  label,
  value,
  icon: Icon,
  colorVariant = "blue",
  subtitle,
}) => {
  const colors = statCardColors[colorVariant];

  return (
    <article
      className={`rounded-xl ${colors.bg} p-5 transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
            {label}
          </p>
          <p className={`mt-2 text-3xl font-bold ${colors.textColor}`}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs font-medium text-gray-600">{subtitle}</p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${colors.iconBg}`}
        >
          <Icon size={24} className={colors.iconColor} strokeWidth={2} />
        </div>
      </div>
    </article>
  );
};
