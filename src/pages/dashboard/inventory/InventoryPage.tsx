import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { confirmAction } from "@/shared/utils/confirm";
import { TableActionsMenu } from "@/shared/components/dashboard/TableActionsMenu";
import { hideRowIds, readHiddenRowIds } from "@/pages/dashboard/common/dashboardTableState";
import { readInventoryRecords } from "./inventoryData";

const statusClassMap: Readonly<Record<string, string>> = {
  "In Stock": "bg-[#eefaf5] text-[#0f7a58]",
  "Low Stock": "bg-[#fff7e8] text-[#9a6700]",
  Reserved: "bg-[#edf5ff] text-[#0066cc]",
  "Out Of Stock": "bg-[#fff1f1] text-[#b42318]",
};

export const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch] = React.useState("");
  const [inventory, setInventory] = React.useState(() => {
    const hiddenIds = readHiddenRowIds("inventory");
    return readInventoryRecords().filter((item) => !hiddenIds.has(item.id));
  });
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>([]);

  const refreshInventory = React.useCallback(() => {
    const hiddenIds = readHiddenRowIds("inventory");
    setInventory(readInventoryRecords().filter((item) => !hiddenIds.has(item.id)));
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
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [inventory, search]);

  const isAllSelected = filteredInventory.length > 0 && filteredInventory.every((item) => selectedIds.includes(item.id));

  const onDeleteInventory = async (inventoryIds: ReadonlyArray<string>) => {
    if (inventoryIds.length === 0) return;

    const confirmed = await confirmAction(
      inventoryIds.length === 1 ? "Delete this inventory row?" : `Delete ${inventoryIds.length} selected inventory rows?`
    );
    if (!confirmed) return;

    hideRowIds("inventory", inventoryIds);
    refreshInventory();
    setSelectedIds((current) => current.filter((id) => !inventoryIds.includes(id)));
    toast.success(`${inventoryIds.length} ${inventoryIds.length === 1 ? "inventory row" : "inventory rows"} deleted.`);
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-(--text)">Inventory</h1>
          <p className="mt-1 max-w-2xl text-sm text-(--muted)">
            Track stock by product variant, branch, available quantity, reserved units, and low-stock state. Open an item to adjust stock and review movement history.
          </p>
        </div>
      </section>

      <section className="rounded-[16px] border border-(--line) bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search SKU, product, variant, branch..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm"
          />
          {selectedIds.length > 0 ? (
            <Button variant="destructive" size="sm" onClick={() => void onDeleteInventory(selectedIds)}>
              <Trash2 size={14} />
              Delete Selected
            </Button>
          ) : null}
        </div>
      </section>

      <section className="overflow-hidden rounded-[16px] border border-(--line) bg-white">
        <Table>
          <TableHeader className="bg-[#f5f5f7]">
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) => setSelectedIds(checked ? filteredInventory.map((item) => item.id) : [])}
                  aria-label="Select all inventory rows"
                />
              </TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead className="text-right">On Hand</TableHead>
              <TableHead className="text-right">Reserved</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-(--muted)">
                  No inventory records found.
                </TableCell>
              </TableRow>
            ) : null}
            {filteredInventory.map((item) => (
              <TableRow key={item.id} className="cursor-pointer" onClick={() => navigate(`/dashboard/inventory/${item.id}`)}>
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={(checked) =>
                      setSelectedIds((current) =>
                        checked === true ? [...current, item.id] : current.filter((id) => id !== item.id)
                      )
                    }
                    aria-label={`Select ${item.productName} ${item.variant}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[10px] border border-(--line) bg-white p-1">
                      <img src={item.coverImage} alt={item.productName} className="max-h-10 w-auto object-contain" />
                    </div>
                    <div>
                      <div className="font-medium text-(--text)">{item.productName}</div>
                      <div className="text-xs text-(--muted)">{item.variant} • {item.sku}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.branch}</TableCell>
                <TableCell className="text-right font-medium">{item.onHand}</TableCell>
                <TableCell className="text-right">{item.reserved}</TableCell>
                <TableCell className="text-right font-medium">{item.available}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClassMap[item.status] ?? statusClassMap["In Stock"]}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                  <TableActionsMenu
                    onView={() => navigate(`/dashboard/inventory/${item.id}`)}
                    onEdit={() => navigate(`/dashboard/inventory/${item.id}`)}
                    onDelete={() => void onDeleteInventory([item.id])}
                    viewLabel="View Item"
                    editLabel="Edit Item"
                    deleteLabel="Delete Item"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};
