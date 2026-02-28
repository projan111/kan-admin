import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLogout } from "@/features/auth";
import { useAuth } from "@/app/providers/AuthContext";
import { usePermission } from "@/shared/hooks/usePermission";
import { Sidebar } from "@/shared/components/dashboard/Sidebar";
import { TopNav } from "@/shared/components/dashboard/TopNav";
import Breadcrumbs from "@/shared/components/dashboard/BreadCrumbs";
import { useContactList } from "@/features/contact";

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { clearAuth, state } = useAuth();
  const canUsersManage = usePermission("users.manage");
  const canContactManage = usePermission("contact.manage");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [viewedContactIds, setViewedContactIds] = React.useState<ReadonlySet<string>>(new Set());
  const contactList = useContactList({ page: 1, limit: 100 }, Boolean(state.user) && canContactManage);

  React.useEffect(() => {
    const syncViewed = () => {
      try {
        const raw = sessionStorage.getItem("viewedContactIds");
        const parsed = raw ? (JSON.parse(raw) as string[]) : [];
        setViewedContactIds(new Set(Array.isArray(parsed) ? parsed : []));
      } catch {
        setViewedContactIds(new Set());
      }
    };
    syncViewed();
    window.addEventListener("viewed-contacts-changed", syncViewed);
    return () => window.removeEventListener("viewed-contacts-changed", syncViewed);
  }, []);

  const unreadContacts = React.useMemo(() => {
    const rows = contactList.data?.data ?? [];
    return rows
      .filter((row) => !row.isView && !(row as { isViewed?: boolean }).isViewed && !viewedContactIds.has(row.id))
      .map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        createdAt: row.createdAt,
      }));
  }, [contactList.data?.data, viewedContactIds]);

  const displayName =
    [state.user?.firstname, state.user?.lastname].filter(Boolean).join(" ").trim() ||
    state.user?.email?.split("@")[0] ||
    "User";

  const onLogout = async () => {
    try {
      await logout.mutateAsync();
    } finally {
      clearAuth();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="flex min-h-screen">
        <Sidebar
          canUsersManage={canUsersManage}
          canContactManage={canContactManage}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          unreadContactsCount={unreadContacts.length}
        />
        <main className="relative flex-1">
          <TopNav
            displayName={displayName}
            roleLabel={state.role ?? "USER"}
            email={state.user?.email}
            profilePicture={
              (state.user as { profileUrl?: string; profile?: string; avatar?: string; image?: string } | null)?.profileUrl ??
              (state.user as { profilePicture?: string; profileUrl?: string; profile?: string; avatar?: string; image?: string } | null)?.profilePicture ??
              (state.user as { profileUrl?: string; profile?: string; avatar?: string; image?: string } | null)?.profile ??
              (state.user as { profileUrl?: string; profile?: string; avatar?: string; image?: string } | null)?.avatar ??
              (state.user as { profileUrl?: string; profile?: string; avatar?: string; image?: string } | null)?.image
            }
            onOpenMobile={() => setMobileOpen(true)}
            onProfile={() => navigate("/dashboard/profile")}
            onLogout={onLogout}
            isLoggingOut={logout.isPending}
            unreadContactsCount={unreadContacts.length}
            unreadContacts={unreadContacts}
          />
          <div className="p-4 md:p-6">
            <div className="mb-4 rounded-xl border border-white/65 bg-white/80 px-3 py-2 text-sm shadow-[var(--card-shadow)] backdrop-blur">
              <Breadcrumbs />
            </div>
            <div className="premium-animate-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
