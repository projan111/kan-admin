import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type Shipment = {
  id: string;
  trackingNumber: string;
  orderNumber: string;
  customerName: string;
  courier: string;
  origin: string;
  destination: string;
  status: "Pending" | "In Transit" | "Delivered" | "Failed" | "Returned";
  shippedDate: string;
  estimatedDelivery: string;
};

// Sample data
const sampleShipments: Shipment[] = [
  {
    id: "1",
    trackingNumber: "TRK-2026-001",
    orderNumber: "ORD-1001",
    customerName: "Alice Martin",
    courier: "FedEx",
    origin: "New York, NY",
    destination: "Los Angeles, CA",
    status: "In Transit",
    shippedDate: "Mar 18, 2026",
    estimatedDelivery: "Mar 22, 2026",
  },
  {
    id: "2",
    trackingNumber: "TRK-2026-002",
    orderNumber: "ORD-1002",
    customerName: "Bob Chen",
    courier: "UPS",
    origin: "Chicago, IL",
    destination: "Miami, FL",
    status: "Delivered",
    shippedDate: "Mar 15, 2026",
    estimatedDelivery: "Mar 19, 2026",
  },
  {
    id: "3",
    trackingNumber: "TRK-2026-003",
    orderNumber: "ORD-1003",
    customerName: "Sara Kim",
    courier: "DHL",
    origin: "Seattle, WA",
    destination: "Boston, MA",
    status: "Pending",
    shippedDate: "Mar 19, 2026",
    estimatedDelivery: "Mar 24, 2026",
  },
  {
    id: "4",
    trackingNumber: "TRK-2026-004",
    orderNumber: "ORD-1004",
    customerName: "Tom Rivera",
    courier: "USPS",
    origin: "Austin, TX",
    destination: "Portland, OR",
    status: "Failed",
    shippedDate: "Mar 16, 2026",
    estimatedDelivery: "Mar 20, 2026",
  },
  {
    id: "5",
    trackingNumber: "TRK-2026-005",
    orderNumber: "ORD-1005",
    customerName: "Nina Patel",
    courier: "FedEx",
    origin: "Denver, CO",
    destination: "Atlanta, GA",
    status: "Returned",
    shippedDate: "Mar 14, 2026",
    estimatedDelivery: "Mar 18, 2026",
  },
];

const statusVariantMap: Record<string, any> = {
  Pending: "pending",
  "In Transit": "qualified",
  Delivered: "completed",
  Failed: "cancelled",
  Returned: "closedLost",
};

export const DeliveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [shipments] = React.useState<Shipment[]>(sampleShipments);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredShipments = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return shipments;

    return shipments.filter((shipment) =>
      [
        shipment.trackingNumber,
        shipment.orderNumber,
        shipment.customerName,
        shipment.courier,
        shipment.status,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [shipments, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = shipments.length;
    const pending = shipments.filter((s) => s.status === "Pending").length;
    const inTransit = shipments.filter((s) => s.status === "In Transit").length;
    const delivered = shipments.filter((s) => s.status === "Delivered").length;
    const failed = shipments.filter((s) => s.status === "Failed").length;

    return { total, pending, inTransit, delivered, failed };
  }, [shipments]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Delivery</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track shipments, courier management, and delivery timeline
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Total Shipments
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Package size={22} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Pending
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Clock size={22} className="text-amber-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-purple-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  In Transit
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.inTransit}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Truck size={22} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Delivered
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.delivered}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Failed
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.failed}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle size={22} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {filteredShipments.length} shipments
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search shipments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-500 outline-none transition-all focus:border-gray-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      filteredShipments.length > 0 &&
                      selectedIds.length === filteredShipments.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? filteredShipments.map((s) => s.id)
                          : [],
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tracking Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Courier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Est. Delivery
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No shipments found.
                  </td>
                </tr>
              ) : null}
              {filteredShipments.map((shipment, idx) => (
                <tr
                  key={shipment.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(shipment.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, shipment.id]
                            : current.filter((id) => id !== shipment.id),
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-gray-900">
                      {shipment.trackingNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                      {shipment.orderNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {shipment.customerName}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {shipment.courier}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-600">
                      <div>{shipment.origin}</div>
                      <div className="text-gray-400">→</div>
                      <div>{shipment.destination}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={shipment.status}
                      variant={statusVariantMap[shipment.status]}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {shipment.estimatedDelivery}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/delivery/shipments/${shipment.id}`,
                          )
                        }
                        className="text-gray-400 transition-colors hover:text-gray-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log("Delete", shipment.id)}
                        className="text-gray-400 transition-colors hover:text-red-600"
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
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
            <p className="text-sm text-gray-600">
              Showing 1-5 of {filteredShipments.length}
            </p>
            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-sm font-medium text-white">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
