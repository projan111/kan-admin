import React from "react";
import { Bell, Menu, Search, User, LogOut, ChevronDown } from "lucide-react";
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
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full items-center gap-4 px-4 py-2 md:px-6">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={onOpenMobile}
          className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 md:hidden"
        >
          <Menu size={20} strokeWidth={2} />
        </button>

        {/* Search Bar */}
        <div className="hidden flex-1 items-center xl:flex">
          <div className="relative w-full max-w-xl">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search products, customers, orders..."
              className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-500 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((v) => !v)}
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50"
            >
              <Bell size={16} strokeWidth={2} />
              {unreadContactsCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
                  {unreadContactsCount > 9 ? "9+" : unreadContactsCount}
                </span>
              ) : null}
            </button>
            {notificationsOpen ? (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-gray-200 bg-white shadow-xl">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Unread Customers
                    </h3>
                  </div>
                  {unreadContacts.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      No unread contacts.
                    </div>
                  ) : null}
                  {unreadContacts.length > 0 ? (
                    <div className="max-h-80 overflow-auto">
                      {unreadContacts.slice(0, 8).map((contact) => (
                        <Link
                          to={`/dashboard/customers/${contact.id}`}
                          key={contact.id}
                          className="block border-b border-gray-50 px-4 py-3 transition-colors hover:bg-gray-50 last:border-0"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {contact.name || contact.email}
                              </p>
                              <p className="truncate text-xs text-gray-500">
                                {contact.email}
                              </p>
                              {contact.createdAt && (
                                <p className="mt-1 text-xs text-gray-400">
                                  {new Date(contact.createdAt).toLocaleString()}
                                </p>
                              )}
                            </div>
                            <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                              New
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                  <div className="border-t border-gray-100 p-2">
                    <Link
                      to="/dashboard/customers"
                      onClick={() => setNotificationsOpen(false)}
                      className="block rounded-lg bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white! transition-colors hover:text-white hover:bg-blue-950"
                    >
                      View All Customers
                    </Link>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              type="button"
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-2 py-1 transition-colors hover:bg-gray-50"
            >
              {profilePicture && !avatarBroken ? (
                <img
                  src={profilePicture}
                  alt={displayName}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100"
                  onError={() => setAvatarBroken(true)}
                />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-linear-to-br from-blue-700 to-blue-900 text-sm font-semibold text-white">
                  {(displayName[0] ?? "K").toUpperCase()}
                </span>
              )}
              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">{roleLabel}</p>
              </div>
              <ChevronDown
                size={16}
                className="hidden text-gray-400 md:block"
              />
            </button>
            {open ? (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpen(false)}
                />
                <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-gray-200 bg-white shadow-xl">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {displayName}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {email ?? "No email"}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        onProfile();
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <User size={16} />
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setOpen(false);
                      }}
                      disabled={isLoggingOut}
                      className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut size={16} />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
