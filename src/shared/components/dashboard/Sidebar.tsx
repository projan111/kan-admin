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
  "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-gray-700 transition-all hover:bg-slate-50 hover:text-slate-900";

const activeLink =
  "bg-blue-300/20 text-blue-950 hover:bg-blue-900/20 [&_.icon-wrapper]:bg-blue-950 [&_.icon]:text-white";

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
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-3.5">
        <NavLink
          to="/dashboard"
          end
          className="flex justify-start gap-3"
          onClick={onCloseMobile}
        >
          <img
            src="/KANWEBSITE/BRANDINGASSETS/COMPANYLOGO/kan2.png"
            className="h-8 w-auto"
            alt="KAN Logo"
          />
        </NavLink>
        <button
          className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 md:hidden"
          onClick={onCloseMobile}
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>
      <nav className="flex-1 space-y-0 overflow-y-auto px-2 py-3">
        {grouped.map((group, groupIndex) => (
          <div key={group.section} className={groupIndex > 0 ? "mt-4" : ""}>
            {group.section !== "Main" && (
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {group.section}
              </p>
            )}
            <div className="space-y-0.5">
              {group.modules.map((module) => {
                const Icon = module.icon;
                const isContact = module.key === "customers";
                const shortcut = module.shortcut;
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
                    <div className="icon-wrapper flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-900/10 to-blue-950/10 transition-colors">
                      <Icon
                        size={16}
                        strokeWidth={2}
                        className="icon text-blue-900 transition-colors"
                      />
                    </div>
                    <span className="min-w-0 flex-1 truncate">
                      {module.label}
                    </span>
                    {isContact && unreadContactsCount > 0 ? (
                      <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {unreadContactsCount > 99 ? "99+" : unreadContactsCount}
                      </span>
                    ) : shortcut ? (
                      <span className="ml-auto text-[11px] font-medium text-gray-400">
                        {shortcut}
                      </span>
                    ) : null}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-gray-100 px-3 py-3">
        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
          <p className="font-medium">Design & Developed by</p>
          <img src="/logo/webx.svg" alt="Webx" className="h-3.5 w-auto" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 border-r border-gray-100 md:block">
        {content}
      </aside>
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        >
          <aside
            className="h-full w-64 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
};
