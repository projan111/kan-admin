import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, MessageSquare, Eye, Edit, Trash2 } from "lucide-react";
import { useContactList } from "@/features/contact";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";
import { formatDateTime } from "@/shared/utils/date";

type ContactRow = Readonly<{
  id: string;
  name: string;
  email: string;
  number: string;
  message: string;
  isView?: boolean;
  isViewed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}>;

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [viewedIds, setViewedIds] = React.useState<ReadonlySet<string>>(
    new Set(),
  );
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const { data: contactsData, isLoading } = useContactList();
  const contacts = (contactsData?.data || []) as ContactRow[];

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem("viewedContactIds");
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      setViewedIds(new Set(Array.isArray(parsed) ? parsed : []));
    } catch {
      setViewedIds(new Set());
    }
  }, []);

  const filteredContacts = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;

    return contacts.filter((contact) =>
      [contact.name, contact.email, contact.number, contact.message].some(
        (value) => value?.toLowerCase().includes(query),
      ),
    );
  }, [contacts, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = contacts.length;
    const unread = contacts.filter(
      (c) => !c.isView && !c.isViewed && !viewedIds.has(c.id),
    ).length;
    const viewed = total - unread;

    return { total, unread, viewed };
  }, [contacts, viewedIds]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-zinc-900">
            Contact Messages
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage customer inquiries and contact form submissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Total Messages
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <MessageSquare size={22} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Unread
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.unread}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Mail size={22} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Viewed
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.viewed}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <Eye size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {filteredContacts.length} messages
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder-slate-500 outline-none transition-all focus:border-zinc-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 bg-white">
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      filteredContacts.length > 0 &&
                      selectedIds.length === filteredContacts.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? filteredContacts.map((c) => c.id)
                          : [],
                      )
                    }
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Created
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No contact messages found.
                  </td>
                </tr>
              ) : null}
              {filteredContacts.map((contact, idx) => {
                const isViewed = Boolean(
                  contact.isView ||
                  contact.isViewed ||
                  viewedIds.has(contact.id),
                );
                return (
                  <tr
                    key={contact.id}
                    className="transition-colors hover:bg-zinc-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(contact.id)}
                        onChange={(e) =>
                          setSelectedIds((current) =>
                            e.target.checked
                              ? [...current, contact.id]
                              : current.filter((id) => id !== contact.id),
                          )
                        }
                        className="h-4 w-4 rounded border-zinc-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-zinc-900">
                        {contact.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {contact.number}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={isViewed ? "Viewed" : "Unread"}
                        variant={isViewed ? "completed" : "cancelled"}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-600">
                        {contact.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDateTime(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/contact/${contact.id}`)
                          }
                          className="text-slate-400 transition-colors hover:text-zinc-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => console.log("Delete", contact.id)}
                          className="text-slate-400 transition-colors hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-6 py-4">
            <p className="text-sm text-slate-600">
              Showing 1-{Math.min(filteredContacts.length, 10)} of{" "}
              {filteredContacts.length}
            </p>
            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 text-sm font-medium text-slate-600 hover:bg-zinc-50">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 text-sm font-medium text-slate-600 hover:bg-zinc-50">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
