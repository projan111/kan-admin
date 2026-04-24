import React from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, Copy, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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

export const ModulePlaceholderPage: React.FC<Props> = ({ title, description, icon: Icon, moduleKey }) => {
  const definition = fakeModuleDefinitions[moduleKey];
  const { state, setState, debouncedSearch } = useListQueryState({ page: 1, limit: 10, search: "" });
  const [rows, setRows] = React.useState<ReadonlyArray<FakeModuleRow>>(definition?.rows ?? []);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>([]);
  const [isMutating, setIsMutating] = React.useState(false);

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

  const onCreate = () => {
    const seed = definition.rows[0];
    if (!seed) return;
    setRows((prev) => [createMockRow(moduleKey, seed, prev.length + 1), ...prev]);
  };

  const renderCell = (value: FakeCellValue) => {
    if (isImage(value)) {
      return (
        <span className="grid h-11 w-11 place-items-center rounded-md border border-[#d2d2d7] bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f7_100%)] text-[11px] font-semibold text-[var(--muted)]">
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

    return <span className="text-[var(--text)]">{String(value ?? "-")}</span>;
  };

  if (!definition) {
    return <div className="text-sm text-[var(--muted)]">No fake module data configured.</div>;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <section className="rounded-md border border-[#d2d2d7] bg-white px-5 py-4 shadow-[var(--card-shadow)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-strong)] text-white">
              <Icon size={20} />
            </span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[var(--text)]">{title}</h1>
              <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">{description}</p>
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
          <Button onClick={onCreate}>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20"><Plus size={13} /></span>
              {definition.createLabel}
            </span>
          </Button>
        </div>
      </div>

      {selectedIds.length > 0 ? (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--muted)]">{selectedIds.length} selected</span>
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

      <div className="overflow-hidden rounded-md border border-[#d2d2d7] bg-white shadow-[var(--card-shadow)]">
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
                <TableCell colSpan={definition.columns.length + 2} className="h-24 text-center text-[var(--muted)]">
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
                    <button
                      type="button"
                      onClick={() => onDuplicate(row)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#d2d2d7] bg-[#eef2f7] text-[#4b5563] transition-colors hover:bg-[#e2e8f0]"
                      aria-label="Edit row"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void onDelete(row.id);
                      }}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#fecdd3] bg-[#fff1f2] text-[#ef4444] transition-colors hover:bg-[#ffe4e6]"
                      aria-label="Delete row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicate(row)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#c7d2fe] bg-[#eef2ff] text-[#475569] transition-colors hover:bg-[#e0e7ff]"
                      aria-label="Duplicate row"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
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
        <span className="text-sm text-[var(--muted)]">{state.page}/{totalPages}</span>
        <Button variant="outline" size="icon" disabled={state.page >= totalPages} onClick={() => setState((prev) => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}><ChevronRight size={14} /></Button>
        <Button variant="outline" size="icon" disabled={state.page >= totalPages} onClick={() => setState((prev) => ({ ...prev, page: totalPages }))}><ChevronRight size={14} /><ChevronRight size={14} className="-ml-2" /></Button>
      </div>
    </div>
  );
};
