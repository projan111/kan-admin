import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Archive,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { confirmAction } from "@/shared/utils/confirm";
import {
  hideRowIds,
  readHiddenRowIds,
} from "@/pages/dashboard/common/dashboardTableState";
import { readInventoryRecords } from "./inventoryData";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

const statusVariantMap: Record<string, any> = {
  "In Stock": "active",
  "Low Stock": "pending",
  Reserved: "qualified",
  "Out Of Stock": "cancelled",
};

export const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch] = React.useState("");
  const [inventory, setInventory] = React.useState(() => {
    const hiddenIds = readHiddenRowIds("inventory");
    return readInventoryRecords().filter((item) => !hiddenIds.has(item.id));
  });
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const refreshInventory = React.useCallback(() => {
    const hiddenIds = readHiddenRowIds("inventory");
    setInventory(
      readInventoryRecords().filter((item) => !hiddenIds.has(item.id)),
    );
  }, []);

  React.useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  const filteredInventory = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return inventory;

    return inventory.filter((item) =>
      [
        item.productName,
        item.variant,
        item.sku,
        item.branch,
        item.category,
        item.status,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [inventory, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const totalItems = inventory.length;
    const inStock = inventory.filter((i) => i.status === "In Stock").length;
    const lowStock = inventory.filter((i) => i.status === "Low Stock").length;
    const outOfStock = inventory.filter(
      (i) => i.status === "Out Of Stock",
    ).length;

    return { totalItems, inStock, lowStock, outOfStock };
  }, [inventory]);

  const onDeleteInventory = async (inventoryIds: ReadonlyArray<string>) => {
    if (inventoryIds.length === 0) return;

    const confirmed = await confirmAction(
      inventoryIds.length === 1
        ? "Delete this inventory row?"
        : `Delete ${inventoryIds.length} selected inventory rows?`,
    );
    if (!confirmed) return;

    hideRowIds("inventory", inventoryIds);
    refreshInventory();
    setSelectedIds((current) =>
      current.filter((id) => !inventoryIds.includes(id)),
    );
    toast.success(
      `${inventoryIds.length} ${inventoryIds.length === 1 ? "inventory row" : "inventory rows"} deleted.`,
    );
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Inventory</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track stock by product variant, branch, available quantity, reserved
            units, and low-stock state. Open an item to adjust stock and review
            movement history.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  In Stock
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.inStock}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Low Stock
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.lowStock}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle size={22} className="text-amber-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Out of Stock
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.outOfStock}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Archive size={22} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {filteredInventory.length} items
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search SKU, product, variant, branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-80 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-500 outline-none transition-all focus:border-gray-400"
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
                      filteredInventory.length > 0 &&
                      selectedIds.length === filteredInventory.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? filteredInventory.map((i) => i.id)
                          : [],
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Branch
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  On Hand
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Reserved
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Available
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
              {filteredInventory.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No inventory records found.
                  </td>
                </tr>
              ) : null}
              {filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, item.id]
                            : current.filter((id) => id !== item.id),
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-1">
                        <img
                          src={item.coverImage}
                          alt={item.productName}
                          className="max-h-10 w-auto object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.productName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.variant} • {item.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.branch}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {item.onHand}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    {item.reserved}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {item.available}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={item.status}
                      variant={statusVariantMap[item.status]}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/inventory/${item.id}`)
                        }
                        className="text-gray-400 transition-colors hover:text-gray-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => void onDeleteInventory([item.id])}
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
              Showing 1-{filteredInventory.length} of {filteredInventory.length}
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
