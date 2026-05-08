import React from "react";
import { FileSearch, Shield, Edit, Trash2, Plus, Eye } from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type AuditLog = {
  id: string;
  admin: string;
  action: "Created" | "Updated" | "Deleted" | "Viewed";
  entity: string;
  entityId: string;
  changes: string;
  ipAddress: string;
  timestamp: string;
  severity: "Low" | "Medium" | "High" | "Critical";
};

// Sample data
const sampleAuditLogs: AuditLog[] = [
  {
    id: "1",
    admin: "Admin User",
    action: "Updated",
    entity: "Product",
    entityId: "PRD-1234",
    changes: "Price changed from $99.99 to $79.99",
    ipAddress: "192.168.1.50",
    timestamp: "May 8, 2026 3:00 PM",
    severity: "Medium",
  },
  {
    id: "2",
    admin: "Super Admin",
    action: "Deleted",
    entity: "User",
    entityId: "USR-5678",
    changes: "User account permanently deleted",
    ipAddress: "192.168.1.51",
    timestamp: "May 8, 2026 2:45 PM",
    severity: "Critical",
  },
  {
    id: "3",
    admin: "Admin User",
    action: "Created",
    entity: "Coupon",
    entityId: "CPN-9012",
    changes: "New coupon: SUMMER2026 - 30% off",
    ipAddress: "192.168.1.50",
    timestamp: "May 8, 2026 2:30 PM",
    severity: "Low",
  },
  {
    id: "4",
    admin: "Manager",
    action: "Updated",
    entity: "Order",
    entityId: "ORD-3456",
    changes: "Status changed from Pending to Shipped",
    ipAddress: "192.168.1.52",
    timestamp: "May 8, 2026 2:15 PM",
    severity: "Low",
  },
  {
    id: "5",
    admin: "Super Admin",
    action: "Updated",
    entity: "Settings",
    entityId: "SET-7890",
    changes: "Payment gateway configuration modified",
    ipAddress: "192.168.1.51",
    timestamp: "May 8, 2026 2:00 PM",
    severity: "High",
  },
  {
    id: "6",
    admin: "Admin User",
    action: "Deleted",
    entity: "Review",
    entityId: "REV-2345",
    changes: "Spam review removed",
    ipAddress: "192.168.1.50",
    timestamp: "May 8, 2026 1:45 PM",
    severity: "Low",
  },
  {
    id: "7",
    admin: "Manager",
    action: "Created",
    entity: "Category",
    entityId: "CAT-6789",
    changes: "New category: Summer Collection",
    ipAddress: "192.168.1.52",
    timestamp: "May 8, 2026 1:30 PM",
    severity: "Low",
  },
  {
    id: "8",
    admin: "Super Admin",
    action: "Updated",
    entity: "User Permissions",
    entityId: "USR-1234",
    changes: "Admin role assigned to user",
    ipAddress: "192.168.1.51",
    timestamp: "May 8, 2026 1:15 PM",
    severity: "High",
  },
];

const actionVariantMap: Record<string, any> = {
  Created: "completed",
  Updated: "qualified",
  Deleted: "cancelled",
  Viewed: "pending",
};

const severityColors: Record<string, string> = {
  Low: "bg-zinc-100 text-zinc-700",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-amber-100 text-amber-700",
  Critical: "bg-red-100 text-red-700",
};

const actionIcons: Record<string, any> = {
  Created: Plus,
  Updated: Edit,
  Deleted: Trash2,
  Viewed: Eye,
};

export const AuditLogsPage: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [logs] = React.useState<AuditLog[]>(sampleAuditLogs);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredLogs = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return logs;

    return logs.filter((log) =>
      [log.admin, log.action, log.entity, log.changes, log.severity].some(
        (value) => value.toLowerCase().includes(query),
      ),
    );
  }, [logs, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = logs.length;
    const created = logs.filter((l) => l.action === "Created").length;
    const updated = logs.filter((l) => l.action === "Updated").length;
    const deleted = logs.filter((l) => l.action === "Deleted").length;
    const critical = logs.filter((l) => l.severity === "Critical").length;

    return { total, created, updated, deleted, critical };
  }, [logs]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-zinc-900">Audit Logs</h1>
          <p className="mt-2 text-sm text-slate-600">
            Track admin changes, security events, and system modifications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Total Audits
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <FileSearch size={22} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Created
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.created}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <Plus size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Updated
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.updated}
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
                  Deleted
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.deleted}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 size={22} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-purple-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Critical
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.critical}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Shield size={22} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {filteredLogs.length} audit logs
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search audit logs..."
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
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Changes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Severity
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
                    colSpan={9}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No audit logs found.
                  </td>
                </tr>
              ) : null}
              {filteredLogs.map((log, idx) => {
                const Icon = actionIcons[log.action];
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
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <Shield size={14} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-zinc-900">
                          {log.admin}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-slate-500" />
                        <StatusBadge
                          status={log.action}
                          variant={actionVariantMap[log.action]}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-900">
                        {log.entity}
                      </span>
                      <div className="text-xs text-slate-400">
                        {log.entityId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs text-sm text-slate-600">
                        {log.changes}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${severityColors[log.severity]}`}
                      >
                        {log.severity}
                      </span>
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
