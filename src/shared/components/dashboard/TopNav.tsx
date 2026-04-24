import React from "react";
import { Bell, Menu, Search } from "lucide-react";
import { Link } from "react-router-dom";

type Props = Readonly<{
  displayName: string;
  roleLabel: string;
  email?: string;
  profilePicture?: string;
  onOpenMobile: () => void;
  onProfile: () => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
  unreadContactsCount?: number;
  unreadContacts?: ReadonlyArray<{
    id: string;
    name: string;
    email: string;
    createdAt?: string;
  }>;
}>;

export const TopNav: React.FC<Props> = ({
  displayName,
  roleLabel,
  email,
  profilePicture,
  onOpenMobile,
  onProfile,
  onLogout,
  isLoggingOut,
  unreadContactsCount = 0,
  unreadContacts = [],
}) => {
  const [open, setOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [avatarBroken, setAvatarBroken] = React.useState(false);

  React.useEffect(() => {
    setAvatarBroken(false);
  }, [profilePicture]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/85 px-3 py-3 backdrop-blur md:px-6">
      <div className="mx-auto flex w-full max-w-375 items-center gap-3">
        <button onClick={onOpenMobile} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)] bg-white text-[var(--text)] md:hidden">
          <Menu size={18} strokeWidth={2} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="hidden md:block">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Control Room</p>
            <h1 className="truncate text-lg font-black tracking-tight text-[var(--text)]">Main Template Commerce Dashboard</h1>
          </div>
        </div>

        <div className="hidden flex-1 items-center xl:flex">
          <div className="relative w-full max-w-md">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              placeholder="Search products, customers, campaigns..."
              className="h-10 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] pl-9 pr-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
            />
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((v) => !v)}
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)] bg-white text-[var(--text)] transition-colors hover:bg-[var(--surface-soft)]"
          >
            <Bell size={18} strokeWidth={2} />
            {unreadContactsCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-semibold text-white">
                {unreadContactsCount > 9 ? "9+" : unreadContactsCount}
              </span>
            ) : null}
          </button>
          {notificationsOpen ? (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/70 bg-white p-2 shadow-[var(--card-shadow)]">
              <div className="px-2 pb-2 text-sm font-bold text-[var(--text)]">Unread Customers</div>
              {unreadContacts.length === 0 ? <div className="px-2 py-3 text-xs text-[var(--muted)]">No unread contacts.</div> : null}
              {unreadContacts.length > 0 ? (
                <div className="max-h-72 space-y-1 overflow-auto">
                  {unreadContacts.slice(0, 8).map((contact) => (
                    <Link
                      to={`/dashboard/customers/${contact.id}`}
                      key={contact.id}
                      className="block rounded-xl px-2.5 py-2 text-xs transition-colors hover:bg-[var(--surface-soft)]"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-semibold text-[var(--text)]">{contact.name || contact.email}</span>
                        <span className="text-[var(--danger)]">Unread</span>
                      </div>
                      <div className="truncate text-[var(--muted)]">{contact.email}</div>
                      <div className="truncate text-[var(--muted)]/80">{contact.createdAt ? new Date(contact.createdAt).toLocaleString() : ""}</div>
                    </Link>
                  ))}
                </div>
              ) : null}
              <Link
                to="/dashboard/customers"
                onClick={() => setNotificationsOpen(false)}
                className="mt-2 block rounded-xl bg-[var(--surface-soft)] px-3 py-2 text-center text-xs font-semibold text-[var(--text)]"
              >
                Open Customers
              </Link>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-2 py-1.5 transition-colors hover:bg-[var(--surface-soft)]"
          >
            {profilePicture && !avatarBroken ? (
              <img
                src={profilePicture}
                alt={displayName}
                className="h-8 w-8 rounded-lg object-cover"
                onError={() => setAvatarBroken(true)}
              />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-strong)] text-xs font-bold text-white">
                {(displayName[0] ?? "U").toUpperCase()}
              </span>
            )}
            <span className="hidden text-left md:block">
              <span className="block text-sm font-semibold text-[var(--text)]">{displayName}</span>
              <span className="block text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">{roleLabel}</span>
            </span>
          </button>
          {open ? (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/70 bg-white p-2 shadow-[var(--card-shadow)]">
              <div className="rounded-xl bg-[var(--surface-soft)] px-3 py-2 text-xs text-[var(--muted)]">{email ?? "No email"}</div>
              <button onClick={onProfile} className="mt-2 w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-soft)]">View Profile</button>
              <button
                onClick={onLogout}
                className="mt-1 w-full rounded-xl bg-red-50 px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-100"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
