import React from "react";
import { RefreshIcon } from "./AppIcons";
import { ui } from "@/shared/styles/ui";

type Props = Readonly<{
  title: string;
  total?: number;
  searchPlaceholder?: string;
  search: string;
  onSearchChange: (v: string) => void;
  limit: number;
  onLimitChange: (v: number) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}>;

export const ListToolbar: React.FC<Props> = ({
  title,
  total,
  searchPlaceholder,
  search,
  onSearchChange,
  limit,
  onLimitChange,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: 12, boxShadow: "var(--shadow)" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{title}</h2>
        {typeof total === "number" ? <div style={{ fontSize: 13, color: "var(--muted)" }}>Total: {total}</div> : null}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder ?? "Search..."}
          style={{ padding: 10, borderRadius: 10, border: "1px solid var(--line)", minWidth: 280, background: "var(--surface-2)" }}
        />

        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          style={{ padding: 10, borderRadius: 10, border: "1px solid var(--line)", background: "var(--surface-2)" }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          title={isRefreshing ? "Refreshing..." : "Refresh"}
          aria-label={isRefreshing ? "Refreshing..." : "Refresh"}
          style={{ ...ui.btnPrimary, opacity: isRefreshing ? 0.7 : 1, width: 38, height: 38, padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        >
          <RefreshIcon size={14} />
        </button>
      </div>
    </div>
  );
};
