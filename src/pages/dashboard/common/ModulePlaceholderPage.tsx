import React from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type Props = Readonly<{
  title: string;
  description: string;
  icon: LucideIcon;
}>;

export const ModulePlaceholderPage: React.FC<Props> = ({ title, description, icon: Icon }) => {
  return (
    <div className="grid max-w-4xl gap-4">
      <section className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[var(--card-shadow)]">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-strong)] text-white">
            <Icon size={22} />
          </span>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[var(--text)]">{title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[var(--card-shadow)]">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Implementation Plan</h3>
        <ul className="mt-3 grid gap-2 text-sm text-[var(--text)]">
          <li>List and filter APIs with pagination and caching.</li>
          <li>Create/edit/view flows with typed forms and server validation.</li>
          <li>Audit logs, permission checks, and lifecycle actions.</li>
          <li>Dashboard KPIs and cross-module analytics hooks.</li>
        </ul>
        <Link to="/dashboard" className="mt-4 inline-flex rounded-xl border border-[var(--line)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)]">
          Back to Dashboard
        </Link>
      </section>
    </div>
  );
};
