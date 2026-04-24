import React from "react";
import { useNavigate } from "react-router-dom";
import { GripVertical, MoreHorizontal, Trash2 } from "lucide-react";
import { confirmAction } from "@/shared/utils/confirm";
import { useListQueryState } from "@/shared/hooks/useListQueryState";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { TableShimmer } from "@/shared/components/TableShimmer";
import { SoftDeleteListToolbar } from "@/shared/components/soft-delete-list/SoftDeleteListToolbar";
import { SoftDeleteListBulkActions } from "@/shared/components/soft-delete-list/SoftDeleteListBulkActions";
import { SoftDeleteListPagination } from "@/shared/components/soft-delete-list/SoftDeleteListPagination";
import { cloneHeadWithSelection, parseListData, sortRows, withDefaultSortOptions } from "@/shared/components/soft-delete-list/softDeleteList.utils";

export type SoftDeleteListTab = "active" | "deleted";

export type SoftDeleteListConfig<TItem> = Readonly<{
  title: string;
  searchPlaceholder?: string;
  createHref?: string;
  createLabel?: string;
  canCreate?: boolean;
  canDelete?: boolean;
  canRecover?: boolean;
  canDestroy?: boolean;
  getRowHref?: (row: TItem) => string | undefined;
  sortOptions?: ReadonlyArray<Readonly<{ label: string; value: string }>>;
  defaultSort?: string;

  useActiveList: (params: Readonly<{ page: number; limit: number; search?: string }>) => {
    data?: Readonly<{ data: ReadonlyArray<TItem>; total?: number; totalPages?: number }> | ReadonlyArray<TItem>;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    refetch: () => unknown;
  };
  useDeletedList: (params: Readonly<{ page: number; limit: number; search?: string }>) => {
    data?: Readonly<{ data: ReadonlyArray<TItem>; total?: number; totalPages?: number }> | ReadonlyArray<TItem>;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    refetch: () => unknown;
  };

  useDelete: () => { isPending: boolean; mutateAsync: (id: string) => Promise<unknown> };
  useRecover: () => { isPending: boolean; mutateAsync: (dto: Readonly<{ ids: ReadonlyArray<string> }>) => Promise<unknown> };
  useDestroy: () => { isPending: boolean; mutateAsync: (id: string) => Promise<unknown> };

  getId: (row: TItem) => string;
  renderHead: () => React.ReactNode;
  renderRow: (row: TItem) => React.ReactNode;
  renderRowActions?: (row: TItem, tab: SoftDeleteListTab) => React.ReactNode;
  enableReorder?: boolean;
  onReorder?: (rows: ReadonlyArray<TItem>) => Promise<unknown> | unknown;
}>;

export function SoftDeleteList<TItem>({ config }: Readonly<{ config: SoftDeleteListConfig<TItem> }>) {
  const navigate = useNavigate();
  const [tab, setTab] = React.useState<SoftDeleteListTab>("active");
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>([]);
  const [sortValue, setSortValue] = React.useState(config.defaultSort ?? "");
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [localRows, setLocalRows] = React.useState<ReadonlyArray<TItem>>([]);
  const { state, setState, debouncedSearch } = useListQueryState({ page: 1, limit: 10, search: "" });

  const params = React.useMemo(
    () => ({
      page: state.page,
      limit: state.limit,
      search: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
    }),
    [state.page, state.limit, debouncedSearch]
  );

  const activeQuery = config.useActiveList(params);
  const deletedQuery = config.useDeletedList(params);
  const listQuery = tab === "active" ? activeQuery : deletedQuery;

  const del = config.useDelete();
  const rec = config.useRecover();
  const des = config.useDestroy();
  const canSeeDeletedTab = (config.canRecover ?? false) || (config.canDestroy ?? false);

  const parsedList = React.useMemo(() => parseListData<TItem>(listQuery.data), [listQuery.data]);
  const { rows, totalPages } = parsedList;
  const sortedRows = React.useMemo(() => sortRows(rows, sortValue), [rows, sortValue]);

  const reorderEnabled = Boolean(config.enableReorder && tab === "active");
  const displayedRows = reorderEnabled ? localRows : sortedRows;
  const allVisibleIds = displayedRows.map((r) => config.getId(r));
  const isAllVisibleSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.includes(id));
  const head = config.renderHead();

  React.useEffect(() => {
    setLocalRows(sortedRows);
  }, [sortedRows]);

  React.useEffect(() => {
    if (listQuery.isLoading) return;
    const safeTotalPages = Math.max(1, totalPages);
    if (state.page > safeTotalPages) {
      setState((prev) => ({ ...prev, page: safeTotalPages }));
    }
  }, [listQuery.isLoading, setState, state.page, totalPages]);

  React.useEffect(() => {
    setSelectedIds([]);
  }, [tab, state.page, state.search, state.limit]);

  React.useEffect(() => {
    if (!canSeeDeletedTab && tab === "deleted") setTab("active");
  }, [canSeeDeletedTab, tab]);

  const onDelete = async (id: string) => {
    const ok = await confirmAction(`Delete this ${config.title}?`);
    if (!ok) return;
    await del.mutateAsync(id);
  };

  const onRecover = async (id: string) => {
    const ok = await confirmAction(`Recover this ${config.title}?`);
    if (!ok) return;
    await rec.mutateAsync({ ids: [id] });
  };

  const onDestroy = async (id: string) => {
    const ok = await confirmAction(`Destroy this ${config.title}? This cannot be undone.`);
    if (!ok) return;
    await des.mutateAsync(id);
  };

  const onToggleRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((x) => x !== id);
    });
  };

  const onToggleAllVisible = (checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        const next = new Set(prev);
        for (const id of allVisibleIds) next.add(id);
        return Array.from(next);
      }
      return prev.filter((id) => !allVisibleIds.includes(id));
    });
  };

  const onDropRow = (targetId: string) => {
    if (!reorderEnabled || !dragId || dragId === targetId) return;
    setLocalRows((prev) => {
      const from = prev.findIndex((r) => config.getId(r) === dragId);
      const to = prev.findIndex((r) => config.getId(r) === targetId);
      if (from < 0 || to < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      if (config.onReorder) void config.onReorder(next);
      return next;
    });
    setDragId(null);
  };

  const onBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const ok = await confirmAction(`Delete ${selectedIds.length} ${config.title} records?`);
    if (!ok) return;
    await del.mutateAsync(selectedIds.join(","));
    setSelectedIds([]);
  };

  const onBulkRecover = async () => {
    if (selectedIds.length === 0) return;
    const ok = await confirmAction(`Recover ${selectedIds.length} ${config.title} records?`);
    if (!ok) return;
    await rec.mutateAsync({ ids: selectedIds });
    setSelectedIds([]);
  };

  const onBulkDestroy = async () => {
    if (selectedIds.length === 0) return;
    const ok = await confirmAction(`Destroy ${selectedIds.length} ${config.title} records? This cannot be undone.`);
    if (!ok) return;
    await des.mutateAsync(selectedIds.join(","));
    setSelectedIds([]);
  };

  const mergedSortOptions = React.useMemo(() => withDefaultSortOptions(config.sortOptions ?? []), [config.sortOptions]);

  return (
    <div className="w-full flex flex-col gap-4">
      <SoftDeleteListToolbar
        searchPlaceholder={config.searchPlaceholder ?? "Search..."}
        searchValue={state.search}
        onSearchChange={(value) => setState((p) => ({ ...p, page: 1, search: value }))}
        isFetching={listQuery.isFetching}
        onRefresh={() => {
          void listQuery.refetch();
        }}
        sortValue={sortValue}
        sortOptions={mergedSortOptions}
        onSortChange={setSortValue}
        tab={tab}
        onTabChange={setTab}
        canSeeDeletedTab={canSeeDeletedTab}
        createHref={config.createHref}
        createLabel={config.createLabel ?? `Create ${config.title}`}
        canCreate={config.canCreate}
      />

      {listQuery.isLoading ? <TableShimmer /> : null}

      <SoftDeleteListBulkActions
        selectedCount={selectedIds.length}
        tab={tab}
        canDelete={config.canDelete}
        canRecover={config.canRecover}
        canDestroy={config.canDestroy}
        deletePending={del.isPending}
        recoverPending={rec.isPending}
        destroyPending={des.isPending}
        onClear={() => setSelectedIds([])}
        onBulkDelete={() => {
          void onBulkDelete();
        }}
        onBulkRecover={() => {
          void onBulkRecover();
        }}
        onBulkDestroy={() => {
          void onBulkDestroy();
        }}
      />

      <div className="overflow-hidden rounded-md border border-[var(--line)] bg-white shadow-[var(--card-shadow)]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[var(--surface-soft)]">
              {cloneHeadWithSelection(
                head,
                <>
                  <TableHead><Checkbox checked={isAllVisibleSelected} onCheckedChange={(v) => onToggleAllVisible(Boolean(v))} /></TableHead>
                  {reorderEnabled ? <TableHead className="w-8" /> : null}
                </>
              )}
            </TableHeader>

            <TableBody>
              {listQuery.isError ? (
                <TableRow><TableCell colSpan={99} className="text-rose-600">Failed to load.</TableCell></TableRow>
              ) : null}

              {!listQuery.isLoading && !listQuery.isError && displayedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={99} className="h-24 text-center text-[var(--muted)]">
                    {tab === "active"
                      ? `No ${config.title.toLowerCase()} records found.`
                      : `No deleted ${config.title.toLowerCase()} records found.`}
                  </TableCell>
                </TableRow>
              ) : null}

              {displayedRows.map((row: TItem) => {
                const id = config.getId(row);
                const href = config.getRowHref?.(row);
                return (
                  <TableRow
                    key={id}
                    draggable={reorderEnabled}
                    onDragStart={() => setDragId(id)}
                    onDragOver={(e) => {
                      if (!reorderEnabled) return;
                      e.preventDefault();
                    }}
                    onDrop={() => onDropRow(id)}
                    onClick={href ? () => navigate(href) : undefined}
                    className={href ? "cursor-pointer" : undefined}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={selectedIds.includes(id)} onCheckedChange={(v) => onToggleRow(id, Boolean(v))} />
                    </TableCell>
                    {reorderEnabled ? (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <GripVertical size={14} className="text-slate-400" />
                      </TableCell>
                    ) : null}
                    {config.renderRow(row)}
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {config.renderRowActions ? config.renderRowActions(row, tab) : null}
                          {tab === "active" ? (
                            config.canDelete === false ? null : (
                              <DropdownMenuItem
                                disabled={del.isPending}
                                onSelect={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onClick={() => {
                                  void onDelete(id);
                                }}
                                className="text-red-600"
                              >
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                  <Trash2 size={14} /> Delete
                                </span>
                              </DropdownMenuItem>
                            )
                          ) : (
                            <>
                              {config.canRecover === false ? null : (
                                <DropdownMenuItem
                                  disabled={rec.isPending}
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onClick={() => {
                                    void onRecover(id);
                                  }}
                                >
                                  Recover
                                </DropdownMenuItem>
                              )}
                              {config.canDestroy === false ? null : (
                                <DropdownMenuItem
                                  disabled={des.isPending}
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onClick={() => {
                                    void onDestroy(id);
                                  }}
                                  className="text-red-600"
                                >
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                    <Trash2 size={14} /> Destroy
                                  </span>
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <SoftDeleteListPagination
        page={state.page}
        totalPages={totalPages}
        onPageChange={(page) => setState((p) => ({ ...p, page }))}
      />
    </div>
  );
}
