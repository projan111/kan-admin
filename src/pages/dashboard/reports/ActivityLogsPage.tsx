import React from "react";
import {
  Activity,
  User,
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  LogIn,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type ActivityLog = {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  type: "View" | "Create" | "Update" | "Delete" | "Login";
  ipAddress: string;
  timestamp: string;
  details: string;
};

// Sample data
const sampleLogs: ActivityLog[] = [
  {
    id: "1",
    user: "Sarah Johnson",
    action: "Viewed product details",
    entity: "Product",
    entityId: "PRD-1234",
    type: "View",
    ipAddress: "192.168.1.100",
    timestamp: "May 8, 2026 2:45 PM",
    details: "Wireless Headphones Pro",
  },
  {
    id: "2",
    user: "Mike Chen",
    action: "Created new order",
    entity: "Order",
    entityId: "ORD-5678",
    type: "Create",
    ipAddress: "192.168.1.101",
    timestamp: "May 8, 2026 2:30 PM",
    details: "Order total: $299.99",
  },
  {
    id: "3",
    user: "Admin User",
    action: "Updated product inventory",
    entity: "Product",
    entityId: "PRD-9012",
    type: "Update",
    ipAddress: "192.168.1.50",
    timestamp: "May 8, 2026 2:15 PM",
    details: "Stock changed from 50 to 45",
  },
  {
    id: "4",
    user: "Emma Wilson",
    action: "Logged in",
    entity: "Auth",
    entityId: "USR-3456",
    type: "Login",
    ipAddress: "192.168.1.102",
    timestamp: "May 8, 2026 2:00 PM",
    details: "Successful login",
  },
  {
    id: "5",
    user: "Admin User",
    action: "Deleted customer review",
    entity: "Review",
    entityId: "REV-7890",
    type: "Delete",
    ipAddress: "192.168.1.50",
    timestamp: "May 8, 2026 1:45 PM",
    details: "Spam review removed",
  },
  {
    id: "6",
    user: "David Brown",
    action: "Added item to cart",
    entity: "Cart",
    entityId: "CRT-2345",
    type: "Create",
    ipAddress: "192.168.1.103",
    timestamp: "May 8, 2026 1:30 PM",
    details: "Smart Watch Ultra",
  },
  {
    id: "7",
    user: "Lisa Anderson",
    action: "Updated profile information",
    entity: "User",
    entityId: "USR-6789",
    type: "Update",
    ipAddress: "192.168.1.104",
    timestamp: "May 8, 2026 1:15 PM",
    details: "Email address changed",
  },
  {
    id: "8",
    user: "Sarah Johnson",
    action: "Viewed order history",
    entity: "Order",
    entityId: "USR-1234",
    type: "View",
    ipAddress: "192.168.1.100",
    timestamp: "May 8, 2026 1:00 PM",
    details: "Accessed order list",
  },
];

const typeVariantMap: Record<string, any> = {
  View: "pending",
  Create: "completed",
  Update: "qualified",
  Delete: "cancelled",
  Login: "closedLost",
};

const typeIcons: Record<string, any> = {
  View: Eye,
  Create: ShoppingCart,
  Update: Edit,
  Delete: Trash2,
  Login: LogIn,
};

export const ActivityLogsPage: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [logs] = React.useState<ActivityLog[]>(sampleLogs);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredLogs = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return logs;

    return logs.filter((log) =>
      [log.user, log.action, log.entity, log.type, log.details].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [logs, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = logs.length;
    const views = logs.filter((l) => l.type === "View").length;
    const creates = logs.filter((l) => l.type === "Create").length;
    const updates = logs.filter((l) => l.type === "Update").length;
    const deletes = logs.filter((l) => l.type === "Delete").length;

    return { total, views, creates, updates, deletes };
  }, [logs]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-zinc-900">
            Activity Logs
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Track user actions, system events, and activity timeline
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Total Activities
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Activity size={22} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-purple-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Views
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.views}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Eye size={22} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Creates
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.creates}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <ShoppingCart size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Updates
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.updates}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Edit size={22} className="text-amber-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Deletes
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.deletes}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 size={22} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {filteredLogs.length} activities
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder-gray-500 outline-none transition-all focus:border-gray-400"
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
                      filteredLogs.length > 0 &&
                      selectedIds.length === filteredLogs.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? filteredLogs.map((l) => l.id) : [],
                      )
                    }
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No activity logs found.
                  </td>
                </tr>
              ) : null}
              {filteredLogs.map((log, idx) => {
                const Icon = typeIcons[log.type];
                return (
                  <tr
                    key={log.id}
                    className="transition-colors hover:bg-zinc-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(log.id)}
                        onChange={(e) =>
                          setSelectedIds((current) =>
                            e.target.checked
                              ? [...current, log.id]
                              : current.filter((id) => id !== log.id),
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
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100">
                          <User size={14} className="text-slate-600" />
                        </div>
                        <span className="text-sm font-medium text-zinc-900">
                          {log.user}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-zinc-900">
                          {log.action}
                        </div>
                        <div className="text-xs text-slate-500">
                          {log.details}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {log.entity}
                      </span>
                      <div className="text-xs text-slate-400">
                        {log.entityId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-slate-500" />
                        <StatusBadge
                          status={log.type}
                          variant={typeVariantMap[log.type]}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {log.timestamp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-6 py-4">
            <p className="text-sm text-slate-600">
              Showing 1-{Math.min(filteredLogs.length, 10)} of{" "}
              {filteredLogs.length}
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
