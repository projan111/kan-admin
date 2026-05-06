import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { confirmAction } from "@/shared/utils/confirm";
import { TableActionsMenu } from "@/shared/components/dashboard/TableActionsMenu";
import { hideRowIds } from "@/pages/dashboard/common/dashboardTableState";
import { readProductRecords } from "./productData";

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState(readProductRecords());
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>([]);

  const refreshRows = React.useCallback(() => {
    setRows(readProductRecords());
  }, []);

  React.useEffect(() => {
    refreshRows();
  }, [refreshRows]);

  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      [row.name, row.category, row.sku, row.salePrice, row.publishStatus].some((value) => value.toLowerCase().includes(query))
    );
  }, [rows, search]);

  const isAllSelected = filteredRows.length > 0 && filteredRows.every((row) => selectedIds.includes(row.id));

  const onDeleteRows = async (rowIds: ReadonlyArray<string>) => {
    if (rowIds.length === 0) return;

    const confirmed = await confirmAction(
      rowIds.length === 1 ? "Delete this product?" : `Delete ${rowIds.length} selected products?`
    );
    if (!confirmed) return;

    hideRowIds("products", rowIds);
    refreshRows();
    setSelectedIds((current) => current.filter((id) => !rowIds.includes(id)));
    toast.success(`${rowIds.length} ${rowIds.length === 1 ? "product" : "products"} deleted.`);
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-(--text)">Products</h1>
          <p className="mt-1 max-w-2xl text-sm text-(--muted)">
            Manage KAN cosmetic products, review catalog entries, and open the cosmetics product form to add a new item.
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard/products/create")}>
          <Plus size={15} />
          Add Product
        </Button>
      </section>

      <section className="rounded-[16px] border border-(--line) bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search product, SKU, category..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm"
          />
          {selectedIds.length > 0 ? (
            <Button variant="destructive" size="sm" onClick={() => void onDeleteRows(selectedIds)}>
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
                  onCheckedChange={(checked) => setSelectedIds(checked ? filteredRows.map((row) => row.id) : [])}
                  aria-label="Select all products"
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-(--muted)">
                  No products found.
                </TableCell>
              </TableRow>
            ) : null}
            {filteredRows.map((row) => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => navigate(`/dashboard/products/${row.id}`)}>
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onCheckedChange={(checked) =>
                      setSelectedIds((current) =>
                        checked === true ? [...current, row.id] : current.filter((id) => id !== row.id)
                      )
                    }
                    aria-label={`Select ${row.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[10px] border border-(--line) bg-white p-1">
                      <img src={row.coverImage} alt={row.name} className="max-h-10 w-auto object-contain" />
                    </div>
                    <div>
                      <div className="font-medium text-(--text)">{row.name}</div>
                      <div className="text-xs text-(--muted)">Cosmetic catalog item</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.sku}</TableCell>
                <TableCell className="text-right font-medium">Rs {row.salePrice}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-[#edf5ff] px-2.5 py-1 text-[11px] font-semibold text-[#0066cc]">
                    {row.publishStatus}
                  </span>
                </TableCell>
                <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                  <TableActionsMenu
                    onView={() => navigate(`/dashboard/products/${row.id}`)}
                    onEdit={() => navigate(`/dashboard/products/${row.id}/edit`)}
                    onDelete={() => void onDeleteRows([row.id])}
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
