import React from "react";
import type { LucideIcon } from "lucide-react";

type Props = Readonly<{
  title: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}>;

export const StatCard: React.FC<Props> = ({ title, value, hint, icon: Icon }) => {
  return (
    <article className="group rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[var(--card-shadow)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(15,32,64,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{title}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-[var(--text)]">{value}</p>
          {hint ? <p className="mt-1.5 text-xs font-medium text-[var(--muted)]">{hint}</p> : null}
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-strong)] text-white">
          <Icon size={20} strokeWidth={2} />
        </span>
      </div>
    </article>
  );
};
