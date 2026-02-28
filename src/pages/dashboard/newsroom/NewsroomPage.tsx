import React from "react";
import {
  useDestroyNewsroom,
  useNewsroomDeleted,
  useNewsroomList,
  useRecoverNewsroom,
  useSoftDeleteNewsroom,
  useUpdateNewsroom,
} from "@/features/newsroom";
import { SoftDeleteList, type SoftDeleteListConfig } from "@/shared/components/SoftDeleteList";
import { usePermission } from "@/shared/hooks/usePermission";
import { Link } from "react-router-dom";
import { formatDateTime } from "@/shared/utils/date";
import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";
import { Edit } from "lucide-react";

type NewsroomRow = Readonly<{
  id: string;
  title: string;
  slug: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}>;

const config: SoftDeleteListConfig<NewsroomRow> = {
  title: "Newsroom",
  searchPlaceholder: "Search title / slug...",
  useActiveList: useNewsroomList,
  useDeletedList: useNewsroomDeleted,
  useDelete: useSoftDeleteNewsroom,
  useRecover: useRecoverNewsroom,
  useDestroy: useDestroyNewsroom,
  getId: (row) => row.id,
  getRowHref: (row) => `/dashboard/newsroom/${row.slug || row.id}`,
  renderHead: () => (
    <tr style={{ background: "#fafafa", textAlign: "left" }}>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Title</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Slug</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Sort</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Created</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Updated</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee", textAlign: "right" }}>Actions</th>
    </tr>
  ),
  renderRow: (n) => (
    <>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{n.title}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{n.slug}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{n.sortOrder ?? "-"}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(n.createdAt)}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(n.updatedAt)}</td>
    </>
  ),
  sortOptions: [
    { label: "Updated (Newest)", value: "updatedAt:desc" },
    { label: "Title (A-Z)", value: "title:asc" },
  ],
  defaultSort: "updatedAt:desc",
};

export const NewsroomPage: React.FC = () => {
  const canCreate = usePermission("entity.create");
  const canUpdate = usePermission("entity.update");
  const canDelete = usePermission("entity.delete");
  const canRecover = usePermission("entity.recover");
  const canDestroy = usePermission("entity.destroy");
  const upd = useUpdateNewsroom();
  return (
    <SoftDeleteList
      config={{
        ...config,
        createHref: "/dashboard/newsroom/create",
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
            <Link to={`/dashboard/newsroom/${row.slug || row.id}/edit`} className="block">
              <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
            </Link>
          ) : null,
      }}
    />
  );
};
