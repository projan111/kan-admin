import React from "react";
import {
  useContactDeleted,
  useContactList,
  useDestroyContact,
  useRecoverContact,
  useSoftDeleteContact,
} from "@/features/contact";
import { SoftDeleteList, type SoftDeleteListConfig } from "@/shared/components/SoftDeleteList";
import { usePermission } from "@/shared/hooks/usePermission";
import { formatDateTime } from "@/shared/utils/date";

type ContactRow = Readonly<{
  id: string;
  name: string;
  email: string;
  number: string;
  message: string;
  isView?: boolean;
  isViewed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}>;

const config: SoftDeleteListConfig<ContactRow> = {
  title: "Contact Messages",
  searchPlaceholder: "Search name / email / number...",
  useActiveList: useContactList,
  useDeletedList: useContactDeleted,
  useDelete: useSoftDeleteContact,
  useRecover: useRecoverContact,
  useDestroy: useDestroyContact,
  getId: (row) => row.id,
  getRowHref: (row) => `/dashboard/contact/${row.id}`,
  renderHead: () => (
    <tr style={{ background: "#fafafa", textAlign: "left" }}>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Name</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Email</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Number</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Status</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Message</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Created</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Updated</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee", textAlign: "right" }}>Actions</th>
    </tr>
  ),
  renderRow: (c) => (
    <>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{c.name}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{c.email}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{c.number}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            border: c.isView ? "1px solid #bfdbfe" : "1px solid #fecaca",
            color: c.isView ? "#1d4ed8" : "#be123c",
            background: c.isView ? "#eff6ff" : "#fff1f2",
          }}
        >
          {c.isView ? "Viewed" : "Unread"}
        </span>
      </td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee", maxWidth: 520 }}>
        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.message}</div>
      </td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(c.createdAt)}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(c.updatedAt)}</td>
    </>
  ),
  sortOptions: [
    { label: "Updated (Newest)", value: "updatedAt:desc" },
    { label: "Name (A-Z)", value: "name:asc" },
  ],
  defaultSort: "updatedAt:desc",
};

export const ContactPage: React.FC = () => {
  const [viewedIds, setViewedIds] = React.useState<ReadonlySet<string>>(new Set());
  const canCreate = usePermission("entity.create");
  const canDelete = usePermission("entity.delete");
  const canRecover = usePermission("entity.recover");
  const canDestroy = usePermission("entity.destroy");

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem("viewedContactIds");
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      setViewedIds(new Set(Array.isArray(parsed) ? parsed : []));
    } catch {
      setViewedIds(new Set());
    }
  }, []);

  return (
    <SoftDeleteList
      config={{
        ...config,
        renderRow: (c) => {
          const isViewed = Boolean(c.isView || c.isViewed || viewedIds.has(c.id));
          return (
            <>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{c.name}</td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{c.email}</td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{c.number}</td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    border: isViewed ? "1px solid #bfdbfe" : "1px solid #fecaca",
                    color: isViewed ? "#1d4ed8" : "#be123c",
                    background: isViewed ? "#eff6ff" : "#fff1f2",
                  }}
                >
                  {isViewed ? "Viewed" : "Unread"}
                </span>
              </td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee", maxWidth: 520 }}>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.message}</div>
              </td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(c.createdAt)}</td>
              <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(c.updatedAt)}</td>
            </>
          );
        },
        createHref: "/dashboard/contact/create",
        canCreate,
        canDelete,
        canRecover,
        canDestroy,
      }}
    />
  );
};
