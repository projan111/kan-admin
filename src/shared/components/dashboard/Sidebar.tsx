import React from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import {
  ecommerceModules,
  ecommerceSidebarOrder,
} from "@/app/config/ecommerceModules";

type Props = Readonly<{
  canUsersManage: boolean;
  canContactManage: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  unreadContactsCount?: number;
}>;

const baseLink =
  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--muted)] transition-all hover:bg-[var(--surface-soft)] hover:text-[var(--text)]";

const activeLink =
  "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-strong)] text-white! shadow-[0_8px_18px_rgba(15,91,216,0.32)] hover:text-white [&_svg]:text-white [&_span]:text-white";

export const Sidebar: React.FC<Props> = ({
  canUsersManage,
  canContactManage,
  mobileOpen,
  onCloseMobile,
  unreadContactsCount = 0,
}) => {
  const filtered = ecommerceModules.filter((module) => {
    if (module.key === "users") return canUsersManage;
    if (module.key === "customers") return canContactManage;
    return true;
  });

  const grouped = ecommerceSidebarOrder
    .map((section) => ({
      section,
      modules: filtered.filter((module) => module.section === section),
    }))
    .filter((group) => group.modules.length > 0);

  const content = (
    <div className="flex h-full flex-col border-r border-white/70 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between border-b border-(--line)/70 px-5 py-4">
        <NavLink
          to="/dashboard"
          end
          className="flex items-center gap-3"
          onClick={onCloseMobile}
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-primary to-(--primary-strong) text-sm font-black tracking-[0.16em] text-white shadow-[0_10px_24px_rgba(15,91,216,0.26)]">
            EC
          </span>
          <span>
            <span className="block text-sm font-black uppercase tracking-[0.12em] text-(--text)">
              Main Template
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-(--muted)">
              Dashboard
            </span>
          </span>
        </NavLink>
        <button
          className="grid h-9 w-9 place-items-center rounded-lg text-(--muted) hover:bg-(--surface-soft) md:hidden"
          onClick={onCloseMobile}
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {grouped.map((group) => (
          <div key={group.section}>
            <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-(--muted)/80">
              {group.section}
            </p>
            <div className="space-y-1">
              {group.modules.map((module) => {
                const Icon = module.icon;
                const isContact = module.key === "customers";
                return (
                  <NavLink
                    key={module.key}
                    to={module.path}
                    end={module.path === "/dashboard"}
                    className={({ isActive }) =>
                      `${baseLink} ${isActive ? activeLink : ""}`
                    }
                    onClick={onCloseMobile}
                  >
                    <Icon size={17} strokeWidth={2} />
                    <span className="min-w-0 flex-1 truncate">
                      {module.label}
                    </span>
                    {isContact && unreadContactsCount > 0 ? (
                      <span className="ml-auto rounded-full bg-(--accent) px-2 py-0.5 text-[10px] font-bold text-white">
                        {unreadContactsCount > 99 ? "99+" : unreadContactsCount}
                      </span>
                    ) : null}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-(--line)/70 px-4 py-4 text-xs text-(--muted)">
        <p className="mb-1 font-medium">Design & Developed by</p>
        <img src="/logo/webx.svg" alt="Webx" className="h-4 w-auto" />
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-72 md:block">
        {content}
      </aside>
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 bg-slate-900/35 md:hidden"
          onClick={onCloseMobile}
        >
          <aside className="h-full w-72" onClick={(e) => e.stopPropagation()}>
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
};
