import React from "react";
import { Bell, Menu, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

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
    <header className="sticky top-0 z-30 border-b border-(--line) bg-white px-3 py-3 md:px-6">
      <div className="mx-auto flex w-full max-w-375 items-center gap-3">
        <Button
          type="button"
          onClick={onOpenMobile}
          variant="outline"
          size="icon"
          className="md:hidden"
        >
          <Menu size={18} strokeWidth={2} />
        </Button>

        <div className="hidden flex-1 items-center xl:flex">
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)"
            />
            <input
              placeholder="Search products, customers, campaigns..."
              className="h-10 w-full rounded-[8px] border border-(--line) bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
        </div>

        <div className="relative">
          <Button
            type="button"
            onClick={() => setNotificationsOpen((v) => !v)}
            variant="outline"
            size="icon"
            className="relative"
          >
            <Bell size={18} strokeWidth={2} />
            {unreadContactsCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-(--danger) px-1 text-[10px] font-semibold text-white">
                {unreadContactsCount > 9 ? "9+" : unreadContactsCount}
              </span>
            ) : null}
          </Button>
          {notificationsOpen ? (
            <div className="absolute right-0 mt-2 w-80 rounded-[18px] border border-(--line) bg-white p-2">
              <div className="px-2 pb-2 text-sm font-bold text-(--text)">
                Unread Customers
              </div>
              {unreadContacts.length === 0 ? (
                <div className="px-2 py-3 text-xs text-(--muted)">
                  No unread contacts.
                </div>
              ) : null}
              {unreadContacts.length > 0 ? (
                <div className="max-h-72 space-y-1 overflow-auto">
                  {unreadContacts.slice(0, 8).map((contact) => (
                    <Link
                      to={`/dashboard/customers/${contact.id}`}
                      key={contact.id}
                      className="block rounded-xl px-2.5 py-2 text-xs transition-colors hover:bg-(--surface-soft)"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-semibold text-(--text)">
                          {contact.name || contact.email}
                        </span>
                        <span className="text-(--danger)">Unread</span>
                      </div>
                      <div className="truncate text-(--muted)">
                        {contact.email}
                      </div>
                      <div className="truncate text-(--muted)/80">
                        {contact.createdAt
                          ? new Date(contact.createdAt).toLocaleString()
                          : ""}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
              <Link
                to="/dashboard/customers"
                onClick={() => setNotificationsOpen(false)}
                className="mt-2 block rounded-xl bg-(--surface-soft) px-3 py-2 text-center text-xs font-semibold text-(--text)"
              >
                Open Customers
              </Link>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <Button
            onClick={() => setOpen((v) => !v)}
            type="button"
            variant="outline"
            className="h-auto gap-2 rounded-full px-2 py-1.5"
          >
            {profilePicture && !avatarBroken ? (
              <img
                src={profilePicture}
                alt={displayName}
                className="h-8 w-8 rounded-lg object-cover"
                onError={() => setAvatarBroken(true)}
              />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-full border border-(--line) bg-(--surface-soft) text-xs font-bold text-(--text)">
                {(displayName[0] ?? "U").toUpperCase()}
              </span>
            )}
            <span className="hidden text-left md:block">
              <span className="block text-sm font-semibold text-(--text)">
                {displayName}
              </span>
              <span className="block text-[11px] uppercase tracking-[0.08em] text-(--muted)">
                {roleLabel}
              </span>
            </span>
          </Button>
          {open ? (
            <div className="absolute right-0 mt-2 w-64 rounded-[18px] border border-(--line) bg-white p-2">
              <div className="rounded-xl bg-(--surface-soft) px-3 py-2 text-xs text-(--muted)">
                {email ?? "No email"}
              </div>
              <Button
                type="button"
                onClick={onProfile}
                variant="ghost"
                className="mt-2 w-full justify-start rounded-[8px] px-3"
              >
                View Profile
              </Button>
              <Button
                type="button"
                onClick={onLogout}
                variant="destructive"
                className="mt-1 w-full justify-start px-3"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
