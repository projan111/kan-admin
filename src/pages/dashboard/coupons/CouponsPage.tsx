import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Tag,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Edit,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type Coupon = {
  id: string;
  code: string;
  description: string;
  discountType: "Percentage" | "Fixed";
  discountValue: string;
  minPurchase: string;
  maxDiscount: string;
  usageLimit: number;
  usageCount: number;
  status: "Active" | "Expired" | "Scheduled" | "Inactive";
  validFrom: string;
  validUntil: string;
};

// Sample data
const sampleCoupons: Coupon[] = [
  {
    id: "1",
    code: "SPRING25",
    description: "Spring Sale - 25% off",
    discountType: "Percentage",
    discountValue: "25%",
    minPurchase: "$50",
    maxDiscount: "$100",
    usageLimit: 1000,
    usageCount: 342,
    status: "Active",
    validFrom: "Mar 1, 2026",
    validUntil: "Mar 31, 2026",
  },
  {
    id: "2",
    code: "WELCOME10",
    description: "Welcome discount for new customers",
    discountType: "Fixed",
    discountValue: "$10",
    minPurchase: "$30",
    maxDiscount: "$10",
    usageLimit: 500,
    usageCount: 128,
    status: "Active",
    validFrom: "Jan 1, 2026",
    validUntil: "Dec 31, 2026",
  },
  {
    id: "3",
    code: "FLASH50",
    description: "Flash sale - 50% off",
    discountType: "Percentage",
    discountValue: "50%",
    minPurchase: "$100",
    maxDiscount: "$200",
    usageLimit: 100,
    usageCount: 100,
    status: "Expired",
    validFrom: "Feb 14, 2026",
    validUntil: "Feb 15, 2026",
  },
  {
    id: "4",
    code: "SUMMER30",
    description: "Summer Sale - 30% off",
    discountType: "Percentage",
    discountValue: "30%",
    minPurchase: "$75",
    maxDiscount: "$150",
    usageLimit: 2000,
    usageCount: 0,
    status: "Scheduled",
    validFrom: "Jun 1, 2026",
    validUntil: "Aug 31, 2026",
  },
  {
    id: "5",
    code: "FREESHIP",
    description: "Free shipping on all orders",
    discountType: "Fixed",
    discountValue: "$15",
    minPurchase: "$0",
    maxDiscount: "$15",
    usageLimit: 5000,
    usageCount: 1234,
    status: "Inactive",
    validFrom: "Jan 1, 2026",
    validUntil: "Dec 31, 2026",
  },
];

const statusVariantMap: Record<string, any> = {
  Active: "qualified",
  Expired: "cancelled",
  Scheduled: "pending",
  Inactive: "closedLost",
};

export const CouponsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [coupons] = React.useState<Coupon[]>(sampleCoupons);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredCoupons = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return coupons;

    return coupons.filter((coupon) =>
      [
        coupon.code,
        coupon.description,
        coupon.discountType,
        coupon.status,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [coupons, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => c.status === "Active").length;
    const expired = coupons.filter((c) => c.status === "Expired").length;
    const scheduled = coupons.filter((c) => c.status === "Scheduled").length;
    const totalUsage = coupons.reduce((sum, c) => sum + c.usageCount, 0);

    return { total, active, expired, scheduled, totalUsage };
  }, [coupons]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Coupons</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage discount codes, activation windows, and usage tracking
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Total Coupons
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Tag size={22} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Active
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.active}
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
                  Expired
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.expired}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle size={22} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Scheduled
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.scheduled}
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
                  Total Usage
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.totalUsage}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <TrendingUp size={22} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {filteredCoupons.length} coupons
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search coupons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-500 outline-none transition-all focus:border-gray-400"
            />
            <button
              onClick={() => navigate("/dashboard/coupons/create")}
              className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              + New Coupon
            </button>
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
                      filteredCoupons.length > 0 &&
                      selectedIds.length === filteredCoupons.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? filteredCoupons.map((c) => c.id)
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
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Discount
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Valid Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No coupons found.
                  </td>
                </tr>
              ) : null}
              {filteredCoupons.map((coupon, idx) => (
                <tr
                  key={coupon.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(coupon.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, coupon.id]
                            : current.filter((id) => id !== coupon.id),
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-bold text-gray-900">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {coupon.description}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {coupon.discountValue}
                      </div>
                      <div className="text-xs text-gray-500">
                        {coupon.discountType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {coupon.usageCount} / {coupon.usageLimit}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-600">
                      <div>{coupon.validFrom}</div>
                      <div>{coupon.validUntil}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={coupon.status}
                      variant={statusVariantMap[coupon.status]}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/coupons/${coupon.id}`)
                        }
                        className="text-gray-400 transition-colors hover:text-gray-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log("Delete", coupon.id)}
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
              Showing 1-5 of {filteredCoupons.length}
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
