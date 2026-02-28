import React from "react";
import { formatDateTime } from "@/shared/utils/date";

type Props = Readonly<{
  title?: string;
  data?: Record<string, unknown> | null;
}>;

function formatValue(key: string, value: unknown): string {
  if (value == null) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    if (key.toLowerCase().includes("date") || key.endsWith("At")) {
      const d = formatDateTime(value);
      return d === "-" ? value : d;
    }
    return value;
  }
  if (Array.isArray(value)) return value.length ? `${value.length} item(s)` : "-";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export const RecordSnapshotCard: React.FC<Props> = ({ title = "Previous Data", data }) => {
  if (!data) return null;

  const entries = Object.entries(data).filter(([, v]) => v !== undefined);

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, background: "#fafafa" }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ display: "grid", gap: 6 }}>
        {entries.map(([k, v]) => (
          <div key={k} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 10, fontSize: 13 }}>
            <span style={{ color: "#666", textTransform: "capitalize" }}>{k}</span>
            <span style={{ color: "#111", wordBreak: "break-word" }}>{formatValue(k, v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
