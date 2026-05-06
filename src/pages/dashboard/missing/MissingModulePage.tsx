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
import { missingModulesMap, type MissingModuleKey } from "./missingModulesData";
import { readMissingModuleRows } from "./missingModulesStore";

type Props = Readonly<{
  moduleKey: MissingModuleKey;
}>;

export const MissingModulePage: React.FC<Props> = ({ moduleKey }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const module = missingModulesMap[moduleKey];
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>([]);
  const [rows, setRows] = React.useState(() => {
    const hiddenIds = readHiddenRowIds(moduleKey);
    return readMissingModuleRows(moduleKey).filter((row) => !hiddenIds.has(row.id));
  });

  const refreshRows = React.useCallback(() => {
    const hiddenIds = readHiddenRowIds(moduleKey);
    setRows(readMissingModuleRows(moduleKey).filter((row) => !hiddenIds.has(row.id)));
  }, [moduleKey]);

  React.useEffect(() => {
    refreshRows();
  }, [refreshRows]);

  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return module.rows;

    return module.rows.filter((row) =>
      [row.title, row.subtitle, ...Object.values(row.columns)].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [rows, search]);

  const isAllSelected = filteredRows.length > 0 && filteredRows.every((row) => selectedIds.includes(row.id));

  const toggleSelectedId = (rowId: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked ? [...current, rowId] : current.filter((id) => id !== rowId)
    );
  };

  const onDeleteRows = async (rowIds: ReadonlyArray<string>) => {
    if (rowIds.length === 0) return;

    const confirmed = await confirmAction(
      rowIds.length === 1
        ? "Delete this record?"
        : `Delete ${rowIds.length} selected ${module.title.toLowerCase()} records?`
    );
    if (!confirmed) return;

    hideRowIds(moduleKey, rowIds);
    refreshRows();
    setSelectedIds((current) => current.filter((id) => !rowIds.includes(id)));
    toast.success(`${rowIds.length} ${rowIds.length === 1 ? "record" : "records"} deleted from ${module.title}.`);
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-(--text)">{module.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-(--muted)">{module.description}</p>
        </div>
      </section>

      <section className="rounded-[16px] border border-(--line) bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder={`Search ${module.title.toLowerCase()}...`}
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
                  onCheckedChange={(checked) =>
                    setSelectedIds(checked ? filteredRows.map((row) => row.id) : [])
                  }
                  aria-label={`Select all ${module.title.toLowerCase()}`}
                />
              </TableHead>
              {module.columns.map((column) => (
                <TableHead key={column.key} className={column.align === "right" ? "text-right" : undefined}>
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="w-16 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={module.columns.length + 2} className="h-24 text-center text-(--muted)">
                  No records found.
                </TableCell>
              </TableRow>
            ) : null}
            {filteredRows.map((row) => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => navigate(`${module.routeBase}/${row.id}`)}>
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onCheckedChange={(checked) => toggleSelectedId(row.id, checked === true)}
                    aria-label={`Select ${row.title}`}
                  />
                </TableCell>
                {module.columns.map((column, index) => (
                  <TableCell key={column.key} className={column.align === "right" ? "text-right" : undefined}>
                    {index === 0 ? (
                      <div>
                        <div className="font-medium text-(--text)">{row.columns[column.key]}</div>
                        <div className="text-xs text-(--muted)">{row.subtitle}</div>
                      </div>
                    ) : (
                      row.columns[column.key]
                    )}
                  </TableCell>
                ))}
                <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                  <TableActionsMenu
                    onView={() => navigate(`${module.routeBase}/${row.id}`)}
                    onEdit={() => navigate(`${module.routeBase}/${row.id}?mode=edit`)}
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
