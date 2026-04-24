import React from "react";
import type { LucideIcon } from "lucide-react";

type Props = Readonly<{
  title: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}>;

export const StatCard: React.FC<Props> = ({
  title,
  value,
  hint,
  icon: Icon,
}) => {
  return (
    <article className="rounded-[18px] border border-(--line) bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">
            {title}
          </p>
          <p className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-(--text)">
            {value}
          </p>
          {hint ? (
            <p className="mt-1.5 text-xs font-medium text-(--muted)">{hint}</p>
          ) : null}
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-full border border-(--line) bg-(--surface-soft) text-(--text)">
          <Icon size={20} strokeWidth={2} />
        </span>
      </div>
    </article>
  );
};
