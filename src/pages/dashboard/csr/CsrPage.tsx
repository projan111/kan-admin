import React from "react";
import { useCsrDeleted, useCsrList, useDestroyCsr, useRecoverCsr, useSoftDeleteCsr, useUpdateCsr } from "@/features/csr";
import { SoftDeleteList, type SoftDeleteListConfig } from "@/shared/components/SoftDeleteList";
import { usePermission } from "@/shared/hooks/usePermission";
import { Link } from "react-router-dom";
import { formatDateTime } from "@/shared/utils/date";
import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";
import { Edit } from "lucide-react";

type CsrRow = Readonly<{
  id: string;
  title: string;
  slug: string;
  status: string;
  date: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}>;

const config: SoftDeleteListConfig<CsrRow> = {
  title: "CSR",
  searchPlaceholder: "Search title / slug...",
  useActiveList: useCsrList,
  useDeletedList: useCsrDeleted,
  useDelete: useSoftDeleteCsr,
  useRecover: useRecoverCsr,
  useDestroy: useDestroyCsr,
  getId: (row) => row.id,
  getRowHref: (row) => `/dashboard/csr/${row.slug || row.id}`,
  renderHead: () => (
    <tr style={{ background: "#fafafa", textAlign: "left" }}>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Title</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Slug</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Status</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Date</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Sort</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Created</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Updated</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee", textAlign: "right" }}>Actions</th>
    </tr>
  ),
  renderRow: (c) => (
    <>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{c.title}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{c.slug}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{c.status}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{c.date}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{c.sortOrder ?? "-"}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(c.createdAt)}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(c.updatedAt)}</td>
    </>
  ),
  sortOptions: [
    { label: "Updated (Newest)", value: "updatedAt:desc" },
    { label: "Date (Newest)", value: "date:desc" },
    { label: "Title (A-Z)", value: "title:asc" },
  ],
  defaultSort: "updatedAt:desc",
};

export const CsrPage: React.FC = () => {
  const canCreate = usePermission("entity.create");
  const canUpdate = usePermission("entity.update");
  const canDelete = usePermission("entity.delete");
  const canRecover = usePermission("entity.recover");
  const canDestroy = usePermission("entity.destroy");
  const upd = useUpdateCsr();

  return (
    <SoftDeleteList
      config={{
        ...config,
        createHref: "/dashboard/csr/create",
        canCreate,
        canDelete,
        canRecover,
        canDestroy,
        enableReorder: canUpdate,
        onReorder: async (rows) => {
          const jobs = rows
            .map((row, index) => (row.sortOrder === index + 1 ? null : upd.mutateAsync({ id: row.id, dto: { sortOrder: index + 1 } })))
            .filter(Boolean) as Promise<unknown>[];
          if (jobs.length) await Promise.all(jobs);
        },
        renderRowActions: (row, tab) =>
          tab === "active" && canUpdate ? (
            <Link to={`/dashboard/csr/${row.slug || row.id}/edit`} className="block">
              <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
            </Link>
          ) : null,
      }}
    />
  );
};
