import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type Cart = {
  id: string;
  customerName: string;
  customerEmail: string;
  items: number;
  total: string;
  status: "Active" | "Abandoned" | "Converted";
  lastActivity: string;
  createdAt: string;
};

// Sample data
const sampleCarts: Cart[] = [
  {
    id: "1",
    customerName: "Alice Martin",
    customerEmail: "alice@acme.com",
    items: 3,
    total: "$125.00",
    status: "Active",
    lastActivity: "2 hours ago",
    createdAt: "Mar 19, 2026",
  },
  {
    id: "2",
    customerName: "Bob Chen",
    customerEmail: "bob@globex.com",
    items: 5,
    total: "$289.50",
    status: "Abandoned",
    lastActivity: "2 days ago",
    createdAt: "Mar 17, 2026",
  },
  {
    id: "3",
    customerName: "Sara Kim",
    customerEmail: "sara@initech.com",
    items: 2,
    total: "$78.00",
    status: "Active",
    lastActivity: "1 hour ago",
    createdAt: "Mar 19, 2026",
  },
  {
    id: "4",
    customerName: "Tom Rivera",
    customerEmail: "tom@umbrella.com",
    items: 4,
    total: "$195.00",
    status: "Converted",
    lastActivity: "3 days ago",
    createdAt: "Mar 16, 2026",
  },
  {
    id: "5",
    customerName: "Nina Patel",
    customerEmail: "nina@hooli.com",
    items: 1,
    total: "$45.00",
    status: "Abandoned",
    lastActivity: "5 days ago",
    createdAt: "Mar 14, 2026",
  },
];

const statusVariantMap: Record<string, any> = {
  Active: "active",
  Abandoned: "pending",
  Converted: "completed",
};

export const CartsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [carts] = React.useState<Cart[]>(sampleCarts);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredCarts = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return carts;

    return carts.filter((cart) =>
      [cart.customerName, cart.customerEmail, cart.status].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [carts, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = carts.length;
    const active = carts.filter((c) => c.status === "Active").length;
    const abandoned = carts.filter((c) => c.status === "Abandoned").length;
    const totalValue = carts.reduce(
      (sum, c) => sum + parseFloat(c.total.replace("$", "")),
      0,
    );

    return {
      total,
      active,
      abandoned,
      totalValue: `$${totalValue.toFixed(2)}`,
    };
  }, [carts]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            Shopping Carts
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Monitor active carts, abandoned carts, and line-item visibility
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Total Carts
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <ShoppingCart size={22} className="text-blue-600" />
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
                <Users size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Abandoned
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.abandoned}
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
                  Total Value
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.totalValue}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <DollarSign size={22} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {filteredCarts.length} carts
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search carts..."
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
                      filteredCarts.length > 0 &&
                      selectedIds.length === filteredCarts.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? filteredCarts.map((c) => c.id) : [],
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Items
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredCarts.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No carts found.
                  </td>
                </tr>
              ) : null}
              {filteredCarts.map((cart, idx) => (
                <tr
                  key={cart.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(cart.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, cart.id]
                            : current.filter((id) => id !== cart.id),
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {cart.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {cart.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {cart.items}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    {cart.total}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={cart.status}
                      variant={statusVariantMap[cart.status]}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {cart.lastActivity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {cart.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/carts/${cart.id}`)}
                        className="text-gray-400 transition-colors hover:text-gray-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log("Delete", cart.id)}
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
              Showing 1-5 of {filteredCarts.length}
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
