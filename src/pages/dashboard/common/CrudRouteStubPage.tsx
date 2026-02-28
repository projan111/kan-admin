import React from "react";
import { Link } from "react-router-dom";

type Props = Readonly<{
  moduleLabel: string;
  mode: "create" | "edit";
  listPath: string;
}>;

export const CrudRouteStubPage: React.FC<Props> = ({ moduleLabel, mode, listPath }) => {
  const title = mode === "create" ? `Create ${moduleLabel}` : `Edit ${moduleLabel}`;

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{title}</h2>
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 14, color: "#444" }}>
        {title} page is routed and ready. Form implementation is pending.
      </div>
      <div>
        <Link
          to={listPath}
          style={{
            display: "inline-block",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            textDecoration: "none",
            color: "#111",
          }}
        >
          Back to {moduleLabel}
        </Link>
      </div>
    </div>
  );
};
