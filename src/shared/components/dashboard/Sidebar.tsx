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
  "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)]";

const activeLink =
  "bg-[#32314b] text-white! hover:bg-[#32314b] hover:text-white [&_svg]:text-white [&_span]:text-white";

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
    <div className="flex h-full flex-col border-r border-(--line) bg-white">
      <div className="flex items-center justify-between border-b border-(--line)/70 ">
        <NavLink
          to="/dashboard"
          end
          className="flex  justify-start   px-4 py-2 gap-3"
          onClick={onCloseMobile}
        >
          <img
            src="/KANWEBSITE/BRANDINGASSETS/COMPANYLOGO/kan2.png"
            className="w-40 h-10"
          ></img>
        </NavLink>
        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-(--line) bg-white text-(--muted) hover:bg-(--surface-soft) md:hidden"
          onClick={onCloseMobile}
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>
      <nav className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {grouped.map((group) => (
          <div key={group.section}>
            <p className="px-2 pb-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-(--muted)/80">
              {group.section}
            </p>
            <div className="space-y-0.5">
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
                      <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
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
      <div className="border-t border-(--line)/70 px-4 flex items-center justify-center gap-2 py-4 text-xs text-(--muted)">
        <p className=" font-medium">Design & Developed by</p>
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
