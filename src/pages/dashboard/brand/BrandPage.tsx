import React from "react";
import { useBrandDeleted, useBrandList, useDestroyBrand, useRecoverBrand, useSoftDeleteBrand, useUpdateBrand } from "@/features/brand";
import { SoftDeleteList, type SoftDeleteListConfig } from "@/shared/components/SoftDeleteList";
import { usePermission } from "@/shared/hooks/usePermission";
import { Link } from "react-router-dom";
import { formatDateTime } from "@/shared/utils/date";
import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";
import { Edit } from "lucide-react";

type BrandRow = Readonly<{
  id: string;
  title: string;
  slug: string;
  link: string;
  sortOrder?: number | null;
  createdAt?: string;
  updatedAt?: string;
}>;

const config: SoftDeleteListConfig<BrandRow> = {
  title: "Brand",
  searchPlaceholder: "Search title / slug...",
  useActiveList: useBrandList,
  useDeletedList: useBrandDeleted,
  useDelete: useSoftDeleteBrand,
  useRecover: useRecoverBrand,
  useDestroy: useDestroyBrand,
  getId: (row) => row.id,
  getRowHref: (row) => `/dashboard/brand/${row.slug || row.id}`,
  renderHead: () => (
    <tr style={{ background: "#fafafa", textAlign: "left" }}>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Title</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Slug</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Link</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Sort</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Created</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Updated</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee", textAlign: "right" }}>Actions</th>
    </tr>
  ),
  renderRow: (b) => (
    <>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{b.title}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{b.slug}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{b.link}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{b.sortOrder ?? "-"}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(b.createdAt)}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(b.updatedAt)}</td>
    </>
  ),
  sortOptions: [
    { label: "Updated (Newest)", value: "updatedAt:desc" },
    { label: "Title (A-Z)", value: "title:asc" },
  ],
  defaultSort: "updatedAt:desc",
};

export const BrandPage: React.FC = () => {
  const canCreate = usePermission("entity.create");
  const canUpdate = usePermission("entity.update");
  const canDelete = usePermission("entity.delete");
  const canRecover = usePermission("entity.recover");
  const canDestroy = usePermission("entity.destroy");
  const upd = useUpdateBrand();

  return (
    <SoftDeleteList
      config={{
        ...config,
        createHref: "/dashboard/brand/create",
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
            <Link to={`/dashboard/brand/${row.slug || row.id}/edit`} className="block">
              <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
            </Link>
          ) : null,
      }}
    />
  );
};
