import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Users, Package, TrendingUp, Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type Wishlist = {
  id: string;
  customerName: string;
  customerEmail: string;
  items: number;
  totalValue: string;
  status: "Active" | "Inactive";
  lastUpdated: string;
  createdAt: string;
};

// Sample data
const sampleWishlists: Wishlist[] = [
  {
    id: "1",
    customerName: "Alice Martin",
    customerEmail: "alice@acme.com",
    items: 8,
    totalValue: "$450.00",
    status: "Active",
    lastUpdated: "1 day ago",
    createdAt: "Mar 15, 2026",
  },
  {
    id: "2",
    customerName: "Bob Chen",
    customerEmail: "bob@globex.com",
    items: 5,
    totalValue: "$320.00",
    status: "Active",
    lastUpdated: "3 days ago",
    createdAt: "Mar 12, 2026",
  },
  {
    id: "3",
    customerName: "Sara Kim",
    customerEmail: "sara@initech.com",
    items: 12,
    totalValue: "$680.00",
    status: "Active",
    lastUpdated: "2 hours ago",
    createdAt: "Mar 18, 2026",
  },
  {
    id: "4",
    customerName: "Tom Rivera",
    customerEmail: "tom@umbrella.com",
    items: 3,
    totalValue: "$125.00",
    status: "Inactive",
    lastUpdated: "2 weeks ago",
    createdAt: "Mar 5, 2026",
  },
  {
    id: "5",
    customerName: "Nina Patel",
    customerEmail: "nina@hooli.com",
    items: 6,
    totalValue: "$290.00",
    status: "Active",
    lastUpdated: "5 days ago",
    createdAt: "Mar 10, 2026",
  },
];

const statusVariantMap: Record<string, any> = {
  Active: "active",
  Inactive: "inactive",
};

export const WishlistsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [wishlists] = React.useState<Wishlist[]>(sampleWishlists);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredWishlists = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return wishlists;

    return wishlists.filter((wishlist) =>
      [wishlist.customerName, wishlist.customerEmail, wishlist.status].some(
        (value) => value.toLowerCase().includes(query),
      ),
    );
  }, [wishlists, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = wishlists.length;
    const active = wishlists.filter((w) => w.status === "Active").length;
    const totalItems = wishlists.reduce((sum, w) => sum + w.items, 0);
    const totalValue = wishlists.reduce(
      (sum, w) => sum + parseFloat(w.totalValue.replace("$", "")),
      0,
    );

    return {
      total,
      active,
      totalItems,
      totalValue: `$${totalValue.toFixed(2)}`,
    };
  }, [wishlists]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
       
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Wishlists</h1>
          <p className="mt-2 text-sm text-gray-600">
            View customer wishlists with product and variant mapping
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-pink-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Total Wishlists
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                <Heart size={22} className="text-pink-600" />
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

          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Total Items
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.totalItems}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Package size={22} className="text-blue-600" />
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
                <TrendingUp size={22} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {filteredWishlists.length} wishlists
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search wishlists..."
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
                      filteredWishlists.length > 0 &&
                      selectedIds.length === filteredWishlists.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? filteredWishlists.map((w) => w.id)
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
                  Customer
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Items
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Updated
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
              {filteredWishlists.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No wishlists found.
                  </td>
                </tr>
              ) : null}
              {filteredWishlists.map((wishlist, idx) => (
                <tr
                  key={wishlist.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(wishlist.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, wishlist.id]
                            : current.filter((id) => id !== wishlist.id),
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
                        {wishlist.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {wishlist.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {wishlist.items}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    {wishlist.totalValue}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={wishlist.status}
                      variant={statusVariantMap[wishlist.status]}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {wishlist.lastUpdated}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {wishlist.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/wishlists/${wishlist.id}`)
                        }
                        className="text-gray-400 transition-colors hover:text-gray-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log("Delete", wishlist.id)}
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
              Showing 1-5 of {filteredWishlists.length}
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
