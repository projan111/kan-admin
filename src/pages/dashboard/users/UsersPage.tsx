import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Edit, Eye, Loader2, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useAdminUsersList, useDeleteAdminUsers } from "@/features/adminUsers";
import type { User } from "@/features/adminUsers/adminUsers.types";
import { useListQueryState } from "@/shared/hooks/useListQueryState";
import { usePermission } from "@/shared/hooks/usePermission";
import { confirmAction } from "@/shared/utils/confirm";
import { formatDateTime } from "@/shared/utils/date";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";
import { TableShimmer } from "@/shared/components/TableShimmer";

export const UsersPage: React.FC = () => {
  const { state, setState, debouncedSearch } = useListQueryState({ page: 1, limit: 10, search: "" });
  const canCreate = usePermission("entity.create");
  const canUpdate = usePermission("entity.update");
  const canDelete = usePermission("entity.delete");

  const listQuery = useAdminUsersList({
    page: state.page,
    limit: state.limit,
    search: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
  });
  const del = useDeleteAdminUsers();

  const rows: ReadonlyArray<User> = listQuery.data?.data ?? [];
  const totalPages = listQuery.data?.totalPages ?? 1;
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>([]);
  const isAllSelected = rows.length > 0 && rows.every((u) => selectedIds.includes(u.id));

  const onDelete = async (id: string) => {
    const ok = await confirmAction("Delete this user?");
    if (!ok) return;
    await del.mutateAsync(id);
  };
  const onBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const ok = await confirmAction(`Delete ${selectedIds.length} users?`);
    if (!ok) return;
    await del.mutateAsync(selectedIds.join(","));
    setSelectedIds([]);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-center justify-between py-1 gap-4">
        <Input
          placeholder="Search email / phone..."
          value={state.search}
          onChange={(e) => setState((p) => ({ ...p, page: 1, search: e.target.value }))}
          className="w-full sm:max-w-sm h-10 rounded-xs border border-slate-300 px-3 text-sm bg-white"
        />
        <div className="flex items-center gap-2">
          {canCreate ? (
            <Link to="/dashboard/users/create" className="inline-flex items-center">
              <Button>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20"><Plus size={13} /></span>
                  Create Users
                </span>
              </Button>
            </Link>
          ) : null}
        </div>
      </div>

      {listQuery.isLoading ? <TableShimmer /> : null}

      {selectedIds.length > 0 && canDelete ? (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">{selectedIds.length} selected</span>
          <Button variant="outline" size="sm" onClick={() => setSelectedIds([])} disabled={del.isPending}>Clear</Button>
          <Button variant="destructive" size="sm" onClick={() => void onBulkDelete()} disabled={del.isPending}>
            {del.isPending ? (
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

      <div className="rounded-xs border border-slate-200 overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead><Checkbox checked={isAllSelected} onCheckedChange={(v) => setSelectedIds(v ? rows.map((u) => u.id) : [])} /></TableHead>
              <TableHead>S.N.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listQuery.isError ? <TableRow><TableCell colSpan={10} className="text-rose-600">Failed to load users.</TableCell></TableRow> : null}
            {!listQuery.isLoading && !listQuery.isError && rows.length === 0 ? <TableRow><TableCell colSpan={10} className="text-slate-500 text-center h-24">No users found.</TableCell></TableRow> : null}
            {rows.map((u, index) => (
              <TableRow key={u.id}>
                <TableCell><Checkbox checked={selectedIds.includes(u.id)} onCheckedChange={(checked) => setSelectedIds((prev) => checked ? [...new Set([...prev, u.id])] : prev.filter((id) => id !== u.id))} /></TableCell>
                <TableCell>{(state.page - 1) * state.limit + index + 1}</TableCell>
                <TableCell>{u.firstname} {u.middlename ? `${u.middlename} ` : ""}{u.lastname}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.isVerified ? "Yes" : "No"}</TableCell>
                <TableCell>{formatDateTime(u.createdAt)}</TableCell>
                <TableCell>{formatDateTime(u.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        {del.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Link to={`/dashboard/users/${u.id}`} className="block"><DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View User</DropdownMenuItem></Link>
                      {canUpdate ? <Link to={`/dashboard/users/${u.id}/edit`} className="block"><DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit User</DropdownMenuItem></Link> : null}
                      {canDelete ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <span className="flex cursor-pointer items-center text-sm text-red-500 gap-2 p-2 hover:bg-red-100 rounded">
                              <Trash2 className="w-4 h-4" />Delete User
                            </span>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => void onDelete(u.id)}
                                disabled={del.isPending}
                              >
                                {del.isPending ? (
                                  <span className="inline-flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                  </span>
                                ) : (
                                  "Confirm"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="icon" disabled={state.page <= 1} onClick={() => setState((p) => ({ ...p, page: 1 }))}><ChevronLeft size={14} /><ChevronLeft size={14} className="-ml-2" /></Button>
        <Button variant="outline" size="icon" disabled={state.page <= 1} onClick={() => setState((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}><ChevronLeft size={14} /></Button>
        <span className="text-sm text-slate-600">{state.page}/{Math.max(1, totalPages)}</span>
        <Button variant="outline" size="icon" disabled={state.page >= totalPages} onClick={() => setState((p) => ({ ...p, page: Math.min(totalPages, p.page + 1) }))}><ChevronRight size={14} /></Button>
        <Button variant="outline" size="icon" disabled={state.page >= totalPages} onClick={() => setState((p) => ({ ...p, page: totalPages }))}><ChevronRight size={14} /><ChevronRight size={14} className="-ml-2" /></Button>
      </div>

    </div>
  );
};
