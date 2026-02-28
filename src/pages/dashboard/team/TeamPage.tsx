import React from "react";
import { useDestroyTeam, useRecoverTeam, useSoftDeleteTeam, useTeamDeleted, useTeamList, useUpdateTeam } from "@/features/team";
import { SoftDeleteList, type SoftDeleteListConfig } from "@/shared/components/SoftDeleteList";
import { usePermission } from "@/shared/hooks/usePermission";
import { Link } from "react-router-dom";
import { formatDateTime } from "@/shared/utils/date";
import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";
import { Edit } from "lucide-react";
import { slugify } from "@/shared/utils/slug";

type TeamRow = Readonly<{
  id: string;
  fullname: string;
  designation: string;
  countryCode: string;
  phoneNumber: string;
  isLeader?: boolean;
  addToHome?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}>;

const config: SoftDeleteListConfig<TeamRow> = {
  title: "Team",
  searchPlaceholder: "Search fullname...",
  useActiveList: useTeamList,
  useDeletedList: useTeamDeleted,
  useDelete: useSoftDeleteTeam,
  useRecover: useRecoverTeam,
  useDestroy: useDestroyTeam,
  getId: (row) => row.id,
  getRowHref: (row) => `/dashboard/team/${slugify(row.fullname || "team-member")}`,
  renderHead: () => (
    <tr style={{ background: "#fafafa", textAlign: "left" }}>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Full Name</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Designation</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Phone</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Leader</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Home</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Created</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>Updated</th>
      <th style={{ padding: 12, borderBottom: "1px solid #eee", textAlign: "right" }}>Actions</th>
    </tr>
  ),
  renderRow: (m) => (
    <>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{m.fullname}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{m.designation}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        {m.countryCode} {m.phoneNumber}
      </td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{m.isLeader ? "Yes" : "No"}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{m.addToHome ? "Yes" : "No"}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(m.createdAt)}</td>
      <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>{formatDateTime(m.updatedAt)}</td>
    </>
  ),
  sortOptions: [
    { label: "Updated (Newest)", value: "updatedAt:desc" },
    { label: "Name (A-Z)", value: "fullname:asc" },
  ],
  defaultSort: "updatedAt:desc",
};

export const TeamPage: React.FC = () => {
  const canCreate = usePermission("entity.create");
  const canUpdate = usePermission("entity.update");
  const canDelete = usePermission("entity.delete");
  const canRecover = usePermission("entity.recover");
  const canDestroy = usePermission("entity.destroy");
  const upd = useUpdateTeam();

  return (
    <SoftDeleteList
      config={{
        ...config,
        createHref: "/dashboard/team/create",
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
            <Link to={`/dashboard/team/${slugify(row.fullname || "team-member")}/edit`} className="block">
              <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
            </Link>
          ) : null,
      }}
    />
  );
};
