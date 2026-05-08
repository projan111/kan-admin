import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type Notification = {
  id: string;
  title: string;
  message: string;
  status: "Sent" | "Scheduled" | "Draft" | "Failed";
  recipients: number;
  delivered: number;
  clicked: number;
  scheduledDate: string;
};

// Sample data
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Flash Sale: 50% Off All Products",
    message: "Don't miss out on our biggest sale of the year!",
    status: "Sent",
    recipients: 5420,
    delivered: 5380,
    clicked: 1245,
    scheduledDate: "May 7, 2026 10:00 AM",
  },
  {
    id: "2",
    title: "New Product Launch Alert",
    message: "Check out our latest lipstick collection",
    status: "Scheduled",
    recipients: 3200,
    delivered: 0,
    clicked: 0,
    scheduledDate: "May 15, 2026 2:00 PM",
  },
  {
    id: "3",
    title: "Your Order Has Shipped",
    message: "Track your package now",
    status: "Sent",
    recipients: 892,
    delivered: 890,
    clicked: 456,
    scheduledDate: "May 6, 2026 3:30 PM",
  },
  {
    id: "4",
    title: "Weekend Special Offer",
    message: "Get 30% off this weekend only",
    status: "Draft",
    recipients: 0,
    delivered: 0,
    clicked: 0,
    scheduledDate: "May 10, 2026 9:00 AM",
  },
  {
    id: "5",
    title: "Cart Abandonment Reminder",
    message: "You left items in your cart",
    status: "Failed",
    recipients: 234,
    delivered: 0,
    clicked: 0,
    scheduledDate: "May 5, 2026 11:00 AM",
  },
];

const statusVariantMap: Record<string, any> = {
  Sent: "completed",
  Scheduled: "qualified",
  Draft: "pending",
  Failed: "cancelled",
};

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [notifications] = React.useState<Notification[]>(sampleNotifications);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredNotifications = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notifications;

    return notifications.filter((notif) =>
      [notif.title, notif.message, notif.status].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [notifications, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = notifications.length;
    const sent = notifications.filter((n) => n.status === "Sent").length;
    const scheduled = notifications.filter(
      (n) => n.status === "Scheduled",
    ).length;
    const failed = notifications.filter((n) => n.status === "Failed").length;
    const totalRecipients = notifications.reduce(
      (sum, n) => sum + n.recipients,
      0,
    );

    return { total, sent, scheduled, failed, totalRecipients };
  }, [notifications]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-zinc-900">
            Push Notifications
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage web push notifications, delivery status, and engagement
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Total
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Bell size={22} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Sent
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.sent}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-purple-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Scheduled
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.scheduled}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Clock size={22} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Failed
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.failed}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle size={22} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-cyan-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Recipients
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.totalRecipients.toLocaleString()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100">
                <Send size={22} className="text-cyan-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {filteredNotifications.length} notifications
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder-gray-500 outline-none transition-all focus:border-gray-400"
            />
            <button
              onClick={() =>
                navigate("/dashboard/web-push-notifications/create")
              }
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              + New Notification
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
                      filteredNotifications.length > 0 &&
                      selectedIds.length === filteredNotifications.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? filteredNotifications.map((n) => n.id)
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
                  Title
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Recipients
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Delivered
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Clicked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Scheduled
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No notifications found.
                  </td>
                </tr>
              ) : null}
              {filteredNotifications.map((notification, idx) => (
                <tr
                  key={notification.id}
                  className="transition-colors hover:bg-zinc-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, notification.id]
                            : current.filter((id) => id !== notification.id),
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
                        {notification.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {notification.message}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-zinc-900">
                    {notification.recipients.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">
                    {notification.delivered.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">
                    {notification.clicked.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={notification.status}
                      variant={statusVariantMap[notification.status]}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {notification.scheduledDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/web-push-notifications/${notification.id}`,
                          )
                        }
                        className="text-slate-400 transition-colors hover:text-zinc-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log("Delete", notification.id)}
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
              Showing 1-{Math.min(filteredNotifications.length, 10)} of{" "}
              {filteredNotifications.length}
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
