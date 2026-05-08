import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { confirmAction } from "@/shared/utils/confirm";
import {
  hideRowIds,
  readHiddenRowIds,
} from "@/pages/dashboard/common/dashboardTableState";
import { readOrderRecords } from "./orderData";
import { PageLayout } from "@/shared/components/dashboard/PageLayout";
import { StatCardV2 } from "@/shared/components/dashboard/StatCardV2";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

const statusVariantMap: Record<string, any> = {
  Pending: "pending",
  Confirmed: "qualified",
  Packed: "qualified",
  Shipped: "proposal",
  Delivered: "completed",
  Cancelled: "cancelled",
  Returned: "closedLost",
};

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch] = React.useState("");
  const [orders, setOrders] = React.useState(readOrderRecords());
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const refreshOrders = React.useCallback(() => {
    const hiddenIds = readHiddenRowIds("orders");
    setOrders(readOrderRecords().filter((order) => !hiddenIds.has(order.id)));
  }, []);

  React.useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const filteredOrders = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((order) =>
      [
        order.id,
        order.orderNumber,
        order.customerName,
        order.customerEmail,
        order.city,
        order.paymentMethod,
        order.status,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [orders, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const shipped = orders.filter((o) => o.status === "Shipped").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;

    return { total, pending, shipped, delivered };
  }, [orders]);

  const onDeleteOrders = async (orderIds: ReadonlyArray<string>) => {
    if (orderIds.length === 0) return;

    const confirmed = await confirmAction(
      orderIds.length === 1
        ? "Delete this order?"
        : `Delete ${orderIds.length} selected orders?`,
    );
    if (!confirmed) return;

    hideRowIds("orders", orderIds);
    refreshOrders();
    setSelectedIds((current) => current.filter((id) => !orderIds.includes(id)));
    toast.success(
      `${orderIds.length} ${orderIds.length === 1 ? "order" : "orders"} deleted.`,
    );
  };

  return (
    <PageLayout title="Orders" showDateFilter showExport>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardV2
          label="TOTAL ORDERS"
          value={stats.total}
          icon={ShoppingCart}
          colorVariant="blue"
        />
        <StatCardV2
          label="PENDING"
          value={stats.pending}
          icon={Package}
          colorVariant="amber"
        />
        <StatCardV2
          label="SHIPPED"
          value={stats.shipped}
          icon={Truck}
          colorVariant="purple"
        />
        <StatCardV2
          label="DELIVERED"
          value={stats.delivered}
          icon={CheckCircle}
          colorVariant="emerald"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {filteredOrders.length} orders
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      filteredOrders.length > 0 &&
                      selectedIds.length === filteredOrders.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? filteredOrders.map((o) => o.id) : [],
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Payment
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : null}
              {filteredOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(order.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, order.id]
                            : current.filter((id) => id !== order.id),
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-600">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.placedAt}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.paymentMethod}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.paymentStatus}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {order.total}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={order.status}
                      variant={statusVariantMap[order.status]}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/orders/${order.id}`)
                        }
                        className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => void onDeleteOrders([order.id])}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <p className="text-sm text-gray-600">
            Showing 1-{filteredOrders.length} of {filteredOrders.length}
          </p>
          <div className="flex items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 bg-gray-900 text-sm font-medium text-white transition-colors">
              1
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
              2
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
              →
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
