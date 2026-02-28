import React from "react";
import { Link } from "react-router-dom";
import { Edit, Eye } from "lucide-react";
import {
  useDestroyFaq,
  useFaqDeleted,
  useFaqList,
  useRecoverFaq,
  useSoftDeleteFaq,
  useUpdateFaq,
} from "@/features/faq";
import { SoftDeleteList, type SoftDeleteListConfig } from "@/shared/components/SoftDeleteList";
import { usePermission } from "@/shared/hooks/usePermission";
import { formatDateTime } from "@/shared/utils/date";
import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";
import { slugify } from "@/shared/utils/slug";

type FaqRow = Readonly<{
  id: string;
  title: string;
  description?: unknown;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}>;

function toPlainText(value: unknown): string {
  if (typeof value === "string") return value.replace(/<[^>]+>/g, "").trim();
  if (value && typeof value === "object") return JSON.stringify(value);
  return "";
}

const config: SoftDeleteListConfig<FaqRow> = {
  title: "FAQ",
  searchPlaceholder: "Filter by question...",
  useActiveList: useFaqList,
  useDeletedList: useFaqDeleted,
  useDelete: useSoftDeleteFaq,
  useRecover: useRecoverFaq,
  useDestroy: useDestroyFaq,
  getId: (row) => row.id,
  getRowHref: (row) => `/dashboard/faq/${slugify(row.title ?? "faq")}`,
  renderHead: () => (
    <tr style={{ background: "#fafafa", textAlign: "left" }}>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Question</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee", maxWidth: 360 }}>Answer</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Active</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Sort</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Created</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Updated</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee", textAlign: "right" }}>Actions</th>
    </tr>
  ),
  renderRow: (row) => (
    <>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{row.title}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee", maxWidth: 360 }}>
        <div className="prose prose-sm max-w-sm line-clamp-1" dangerouslySetInnerHTML={{ __html: typeof row.description === "string" ? row.description : toPlainText(row.description) || "-" }} />
      </td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{row.isActive ? "Yes" : "No"}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{row.sortOrder ?? "-"}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(row.createdAt)}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(row.updatedAt)}</td>
    </>
  ),
  sortOptions: [
    { label: "Updated (Newest)", value: "updatedAt:desc" },
    { label: "Sort Order", value: "sortOrder:asc" },
    { label: "Question (A-Z)", value: "title:asc" },
  ],
  defaultSort: "updatedAt:desc",
};

export const FaqPage: React.FC = () => {
  const canCreate = usePermission("entity.create");
  const canUpdate = usePermission("entity.update");
  const canDelete = usePermission("entity.delete");
  const canRecover = usePermission("entity.recover");
  const canDestroy = usePermission("entity.destroy");
  const upd = useUpdateFaq();

  return (
    <SoftDeleteList
      config={{
        ...config,
        createHref: "/dashboard/faq/create",
        createLabel: "Add FAQ",
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
        renderRowActions: (row, tab) => (
          <>
            <Link to={`/dashboard/faq/${slugify(row.title ?? "faq")}`} className="block">
              <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View FAQ</DropdownMenuItem>
            </Link>
            {tab === "active" && canUpdate ? (
              <Link to={`/dashboard/faq/${slugify(row.title ?? "faq")}/edit`} className="block">
                <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit FAQ</DropdownMenuItem>
              </Link>
            ) : null}
          </>
        ),
      }}
    />
  );
};

