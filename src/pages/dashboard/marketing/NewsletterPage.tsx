import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Users, UserCheck, UserX, Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type Subscriber = {
  id: string;
  email: string;
  name: string;
  status: "Active" | "Unsubscribed" | "Bounced";
  segment: string;
  subscribedDate: string;
  source: string;
};

// Sample data
const sampleSubscribers: Subscriber[] = [
  {
    id: "1",
    email: "sarah.j@email.com",
    name: "Sarah Johnson",
    status: "Active",
    segment: "VIP Customers",
    subscribedDate: "Jan 15, 2026",
    source: "Website",
  },
  {
    id: "2",
    email: "mike.chen@email.com",
    name: "Mike Chen",
    status: "Active",
    segment: "New Subscribers",
    subscribedDate: "Mar 20, 2026",
    source: "Checkout",
  },
  {
    id: "3",
    email: "emma.w@email.com",
    name: "Emma Wilson",
    status: "Unsubscribed",
    segment: "General",
    subscribedDate: "Dec 10, 2025",
    source: "Popup",
  },
  {
    id: "4",
    email: "david.b@email.com",
    name: "David Brown",
    status: "Active",
    segment: "Product Updates",
    subscribedDate: "Apr 5, 2026",
    source: "Website",
  },
  {
    id: "5",
    email: "lisa.a@email.com",
    name: "Lisa Anderson",
    status: "Bounced",
    segment: "General",
    subscribedDate: "Feb 28, 2026",
    source: "Social Media",
  },
];

const statusVariantMap: Record<string, any> = {
  Active: "completed",
  Unsubscribed: "cancelled",
  Bounced: "closedLost",
};

export const NewsletterPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [subscribers] = React.useState<Subscriber[]>(sampleSubscribers);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredSubscribers = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return subscribers;

    return subscribers.filter((sub) =>
      [sub.email, sub.name, sub.segment, sub.status].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [subscribers, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = subscribers.length;
    const active = subscribers.filter((s) => s.status === "Active").length;
    const unsubscribed = subscribers.filter(
      (s) => s.status === "Unsubscribed",
    ).length;
    const bounced = subscribers.filter((s) => s.status === "Bounced").length;

    return { total, active, unsubscribed, bounced };
  }, [subscribers]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-zinc-900">Newsletter</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage email subscribers, segments, and subscription status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Total Subscribers
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Users size={22} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Active
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.active}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <UserCheck size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Unsubscribed
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.unsubscribed}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <UserX size={22} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Bounced
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.bounced}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Mail size={22} className="text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {filteredSubscribers.length} subscribers
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search subscribers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder-gray-500 outline-none transition-all focus:border-gray-400"
            />
            <button
              onClick={() => navigate("/dashboard/newsletter/import")}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              + Import Subscribers
            </button>
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
                      filteredSubscribers.length > 0 &&
                      selectedIds.length === filteredSubscribers.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? filteredSubscribers.map((s) => s.id)
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
                  Subscriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Subscribed
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No subscribers found.
                  </td>
                </tr>
              ) : null}
              {filteredSubscribers.map((subscriber, idx) => (
                <tr
                  key={subscriber.id}
                  className="transition-colors hover:bg-zinc-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(subscriber.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, subscriber.id]
                            : current.filter((id) => id !== subscriber.id),
                        )
                      }
                      className="h-4 w-4 rounded border-zinc-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-zinc-900">
                        {subscriber.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {subscriber.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                      {subscriber.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {subscriber.source}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={subscriber.status}
                      variant={statusVariantMap[subscriber.status]}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {subscriber.subscribedDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/newsletter/${subscriber.id}`)
                        }
                        className="text-slate-400 transition-colors hover:text-zinc-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log("Delete", subscriber.id)}
                        className="text-slate-400 transition-colors hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-6 py-4">
            <p className="text-sm text-slate-600">
              Showing 1-{Math.min(filteredSubscribers.length, 10)} of{" "}
              {filteredSubscribers.length}
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
