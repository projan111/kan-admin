import React from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, Copy, Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { useListQueryState } from "@/shared/hooks/useListQueryState";
import { confirmAction } from "@/shared/utils/confirm";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { fakeModuleDefinitions, type FakeBadgeTone, type FakeCellValue, type FakeModuleRow } from "@/pages/dashboard/common/moduleFakeData";

type Props = Readonly<{
  title: string;
  description: string;
  icon: LucideIcon;
  moduleKey: string;
}>;

const badgeToneClassNames: Record<FakeBadgeTone, string> = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700",
  info: "bg-sky-50 text-sky-700",
  neutral: "bg-slate-100 text-slate-700",
};

const isBadge = (value: FakeCellValue): value is Readonly<{ kind: "badge"; label: string; tone: FakeBadgeTone }> =>
  typeof value === "object" && value !== null && "kind" in value && value.kind === "badge";

const isBadges = (
  value: FakeCellValue
): value is Readonly<{ kind: "badges"; items: ReadonlyArray<Readonly<{ kind: "badge"; label: string; tone: FakeBadgeTone }>> }> =>
  typeof value === "object" && value !== null && "kind" in value && value.kind === "badges";

const isImage = (value: FakeCellValue): value is Readonly<{ kind: "image"; label: string }> =>
  typeof value === "object" && value !== null && "kind" in value && value.kind === "image";

const isToggle = (value: FakeCellValue): value is Readonly<{ kind: "toggle"; checked: boolean }> =>
  typeof value === "object" && value !== null && "kind" in value && value.kind === "toggle";

const stringifyValue = (value: FakeCellValue) => {
  if (isBadge(value)) return value.label;
  if (isBadges(value)) return value.items.map((item) => item.label).join(" ");
  if (isImage(value)) return value.label;
  if (isToggle(value)) return value.checked ? "enabled active on" : "disabled inactive off";
  return String(value);
};

const createMockRow = (moduleKey: string, row: FakeModuleRow, count: number): FakeModuleRow => {
  const prefix = moduleKey.slice(0, 3).toUpperCase();
  const nextId = `${prefix}-${String(9000 + count).padStart(4, "0")}`;
  const nextRow: Record<string, FakeCellValue> = {};

  Object.entries(row).forEach(([key, value]) => {
    if (key === "id") {
      nextRow[key] = nextId;
      return;
    }

    if (isBadge(value)) {
      nextRow[key] = { kind: "badge", label: value.label, tone: value.tone };
      return;
    }

    if (isBadges(value)) {
      nextRow[key] = {
        kind: "badges",
        items: value.items.map((item) => ({ kind: "badge", label: item.label, tone: item.tone })),
      };
      return;
    }

    if (isImage(value)) {
      nextRow[key] = { kind: "image", label: `New ${value.label}` };
      return;
    }

    if (isToggle(value)) {
      nextRow[key] = { kind: "toggle", checked: !value.checked };
      return;
    }

    if (typeof value === "number") {
      nextRow[key] = value + 1;
      return;
    }

    nextRow[key] = String(value).includes("#") ? String(value) : `New ${String(value)}`;
  });

  return nextRow as FakeModuleRow;
};

const getInitials = (label: string) =>
  label
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

type PurchaseType = "Fixed Price" | "Timed Auction" | "Open for Bids";

const purchaseTypes: ReadonlyArray<{ type: PurchaseType; description: string }> = [
  { type: "Fixed Price", description: "Set fixed price for people to buy your product instantly" },
  { type: "Timed Auction", description: "Set fixed price for people to buy your product instantly" },
  { type: "Open for Bids", description: "Set fixed price for people to buy your product instantly" },
];

type CreateModalProps = Readonly<{
  title: string;
  onClose: () => void;
  onSubmit: () => void;
}>;

const CreateItemModal: React.FC<CreateModalProps> = ({ title, onClose, onSubmit }) => {
  const [purchaseType, setPurchaseType] = React.useState<PurchaseType>("Fixed Price");

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-3xl rounded-[14px] border border-[#d2d2d7] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#d2d2d7] px-6 py-4">
          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">Create {title}</h2>
            <p className="mt-0.5 text-[13px] text-[#6e6e73]">Dashboard / Create {title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-[8px] border border-[#d2d2d7] text-[#6e6e73] hover:bg-[#f5f5f7]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload + Preview */}
          <div className="grid gap-5 md:grid-cols-[1fr_220px]">
            {/* Upload File */}
            <div>
              <p className="mb-2 text-[13px] font-semibold text-[#1d1d1f]">Upload File</p>
              <div className="flex h-[180px] flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-[#d2d2d7] bg-[#fafafc] text-center transition-colors hover:border-[#0071e3] hover:bg-[#f0f5ff]">
                <div className="grid h-11 w-11 place-items-center rounded-[10px] border border-[#d2d2d7] bg-white text-[#6e6e73]">
                  <Upload size={20} />
                </div>
                <p className="text-[12px] text-[#6e6e73]">Max 120 MB, PNG, JPEG, MP3, MP4</p>
                <button
                  type="button"
                  className="mt-1 rounded-[8px] bg-[#1d1d1f] px-4 py-2 text-[13px] font-semibold text-white hover:bg-black"
                >
                  Browse File
                </button>
              </div>
            </div>

            {/* Preview */}
            <div>
              <p className="mb-2 text-[13px] font-semibold text-[#1d1d1f]">Preview File</p>
              <div className="flex h-[180px] items-center justify-center rounded-[10px] border border-[#d2d2d7] bg-[#f5f5f7] text-[12px] text-[#6e6e73]">
                No preview
              </div>
            </div>
          </div>

          {/* Purchase Type */}
          <div>
            <p className="mb-3 text-[15px] font-semibold text-[#1d1d1f]">Purchase Type</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {purchaseTypes.map(({ type, description }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPurchaseType(type)}
                  className={`rounded-[10px] border p-4 text-left transition-colors ${
                    purchaseType === type
                      ? "border-[#0071e3] bg-[#f0f5ff]"
                      : "border-[#d2d2d7] bg-white hover:border-[#86868b]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`grid h-4 w-4 place-items-center rounded-full border-2 ${purchaseType === type ? "border-[#0071e3]" : "border-[#86868b]"}`}>
                      {purchaseType === type ? <span className="h-2 w-2 rounded-full bg-[#0071e3]" /> : null}
                    </span>
                    <span className="text-[13px] font-semibold text-[#1d1d1f]">{type}</span>
                  </div>
                  <p className="mt-2 text-[12px] leading-5 text-[#6e6e73]">{description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Details */}
          <div>
            <p className="mb-4 text-[15px] font-semibold text-[#1d1d1f]">Main Details</p>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#1d1d1f]">Title</label>
                  <input
                    type="text"
                    placeholder="Enter title"
                    className="h-10 w-full rounded-[8px] border border-[#d2d2d7] bg-white px-3 text-[13px] text-[#1d1d1f] outline-none placeholder:text-[#86868b] focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#1d1d1f]">Price</label>
                  <input
                    type="text"
                    placeholder="Enter price"
                    className="h-10 w-full rounded-[8px] border border-[#d2d2d7] bg-white px-3 text-[13px] text-[#1d1d1f] outline-none placeholder:text-[#86868b] focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]/20"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                {["Size", "Properties", "Royalty", "Currency"].map((field) => (
                  <div key={field}>
                    <label className="mb-1.5 block text-[12px] font-semibold text-[#1d1d1f]">{field}</label>
                    <input
                      type="text"
                      placeholder={`Enter ${field.toLowerCase()}`}
                      className="h-10 w-full rounded-[8px] border border-[#d2d2d7] bg-white px-3 text-[13px] text-[#1d1d1f] outline-none placeholder:text-[#86868b] focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]/20"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#1d1d1f]">Description</label>
                <textarea
                  rows={4}
                  placeholder="Enter description"
                  className="w-full resize-y rounded-[8px] border border-[#d2d2d7] bg-white px-3 py-2.5 text-[13px] text-[#1d1d1f] outline-none placeholder:text-[#86868b] focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-[#d2d2d7] px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            <Plus size={15} />
            Create {title}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ModulePlaceholderPage: React.FC<Props> = ({ title, description, icon: Icon, moduleKey }) => {
  const definition = fakeModuleDefinitions[moduleKey];
  const { state, setState, debouncedSearch } = useListQueryState({ page: 1, limit: 10, search: "" });
  const [rows, setRows] = React.useState<ReadonlyArray<FakeModuleRow>>(definition?.rows ?? []);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>([]);
  const [isMutating, setIsMutating] = React.useState(false);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  React.useEffect(() => {
    setRows(definition?.rows ?? []);
    setSelectedIds([]);
    setState((prev) => ({ ...prev, page: 1, search: "" }));
  }, [definition, setState]);

  const filteredRows = React.useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => Object.values(row).some((value) => stringifyValue(value).toLowerCase().includes(query)));
  }, [debouncedSearch, rows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / state.limit));
  const visibleRows = React.useMemo(() => {
    const start = (state.page - 1) * state.limit;
    return filteredRows.slice(start, start + state.limit);
  }, [filteredRows, state.limit, state.page]);

  React.useEffect(() => {
    if (state.page > totalPages) {
      setState((prev) => ({ ...prev, page: totalPages }));
    }
  }, [setState, state.page, totalPages]);

  const isAllSelected = visibleRows.length > 0 && visibleRows.every((row) => selectedIds.includes(row.id));

  const onDelete = async (id: string) => {
    const ok = await confirmAction(`Delete this ${definition.singularLabel}?`);
    if (!ok) return;
    setIsMutating(true);
    setRows((prev) => prev.filter((row) => row.id !== id));
    setSelectedIds((prev) => prev.filter((rowId) => rowId !== id));
    setIsMutating(false);
  };

  const onBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const ok = await confirmAction(`Delete ${selectedIds.length} ${title.toLowerCase()} records?`);
    if (!ok) return;
    setIsMutating(true);
    setRows((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
    setSelectedIds([]);
    setIsMutating(false);
  };

  const onDuplicate = (row: FakeModuleRow) => {
    setRows((prev) => [createMockRow(moduleKey, row, prev.length + 1), ...prev]);
  };

  const onCreateSubmit = () => {
    const seed = definition.rows[0];
    if (seed) setRows((prev) => [createMockRow(moduleKey, seed, prev.length + 1), ...prev]);
    setIsCreateOpen(false);
  };

  const renderCell = (value: FakeCellValue) => {
    if (isImage(value)) {
      return (
        <span className="grid h-11 w-11 place-items-center rounded-md border border-[#d2d2d7] bg-[#f5f5f7] text-[11px] font-semibold text-(--muted)">
          {getInitials(value.label)}
        </span>
      );
    }

    if (isToggle(value)) {
      return (
        <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value.checked ? "bg-[#10b981]" : "bg-[#dbe4ee]"}`}>
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.18)] transition-transform ${value.checked ? "translate-x-6" : "translate-x-1"}`} />
        </span>
      );
    }

    if (isBadge(value)) {
      return <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${badgeToneClassNames[value.tone]}`}>{value.label}</span>;
    }

    if (isBadges(value)) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {value.items.map((item) => (
            <span key={`${item.label}-${item.tone}`} className={`rounded-md px-2 py-1 text-[11px] font-semibold ${badgeToneClassNames[item.tone]}`}>
              {item.label}
            </span>
          ))}
        </div>
      );
    }

    return <span className="text-(--text)">{String(value ?? "-")}</span>;
  };

  if (!definition) {
    return <div className="text-sm text-(--muted)">No fake module data configured.</div>;
  }

  return (
    <>
      {isCreateOpen ? (
        <CreateItemModal
          title={title}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={onCreateSubmit}
        />
      ) : null}

      <div className="flex w-full flex-col gap-4">
        <section className="px-1 py-1">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 place-items-center text-primary">
                <Icon size={20} />
              </span>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-(--text)">{title}</h1>
                <p className="mt-1 max-w-2xl text-sm text-(--muted)">{description}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col items-center justify-between gap-4 py-1 sm:flex-row">
          <Input
            placeholder={definition.searchPlaceholder}
            value={state.search}
            onChange={(event) => setState((prev) => ({ ...prev, page: 1, search: event.target.value }))}
            className="h-10 w-full bg-white sm:max-w-sm"
          />
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus size={15} />
              {definition.createLabel}
            </Button>
          </div>
        </div>

        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-(--muted)">{selectedIds.length} selected</span>
            <Button variant="outline" size="sm" onClick={() => setSelectedIds([])} disabled={isMutating}>Clear</Button>
            <Button variant="destructive" size="sm" onClick={() => void onBulkDelete()} disabled={isMutating}>
              {isMutating ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Selected"
              )}
            </Button>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-[12px] border border-[#d2d2d7] bg-white">
          <Table>
            <TableHeader className="bg-[#f5f5f7]">
              <TableRow>
                <TableHead><Checkbox checked={isAllSelected} onCheckedChange={(checked) => setSelectedIds(Boolean(checked) ? visibleRows.map((row) => row.id) : [])} /></TableHead>
                {definition.columns.map((column) => (
                  <TableHead key={column.key} className={column.align === "right" ? "text-right" : undefined}>{column.label}</TableHead>
                ))}
                <TableHead className="min-w-36 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={definition.columns.length + 2} className="h-24 text-center text-(--muted)">
                    No {title.toLowerCase()} records found.
                  </TableCell>
                </TableRow>
              ) : null}
              {visibleRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onCheckedChange={(checked) => setSelectedIds((prev) => (checked ? [...new Set([...prev, row.id])] : prev.filter((id) => id !== row.id)))}
                    />
                  </TableCell>
                  {definition.columns.map((column) => (
                    <TableCell key={column.key} className={column.align === "right" ? "text-right" : undefined}>
                      {renderCell(row[column.key])}
                    </TableCell>
                  ))}
                  <TableCell className="min-w-36 text-right">
                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => onDuplicate(row)}
                        className="h-8 w-8 rounded-[6px] bg-(--surface-soft) text-(--muted)"
                        aria-label="Edit row"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => { void onDelete(row.id); }}
                        className="h-8 w-8 rounded-[6px]"
                        aria-label="Delete row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => onDuplicate(row)}
                        className="h-8 w-8 rounded-[6px] bg-(--surface-soft) text-(--muted)"
                        aria-label="Duplicate row"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="icon" disabled={state.page <= 1} onClick={() => setState((prev) => ({ ...prev, page: 1 }))}><ChevronLeft size={14} /><ChevronLeft size={14} className="-ml-2" /></Button>
          <Button variant="outline" size="icon" disabled={state.page <= 1} onClick={() => setState((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}><ChevronLeft size={14} /></Button>
          <span className="text-sm text-(--muted)">{state.page}/{totalPages}</span>
          <Button variant="outline" size="icon" disabled={state.page >= totalPages} onClick={() => setState((prev) => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}><ChevronRight size={14} /></Button>
          <Button variant="outline" size="icon" disabled={state.page >= totalPages} onClick={() => setState((prev) => ({ ...prev, page: totalPages }))}><ChevronRight size={14} /><ChevronRight size={14} className="-ml-2" /></Button>
        </div>
      </div>
    </>
  );
};
