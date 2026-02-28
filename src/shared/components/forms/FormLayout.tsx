import React from "react";

type Props = Readonly<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  aside?: React.ReactNode;
}>;

export const FormLayout: React.FC<Props> = ({ title, subtitle, actions, children, aside }) => {
  return (
    <div style={{ display: "grid", gap: 14, maxWidth: 960, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", padding: "4px 4px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{title}</h2>
          {subtitle ? <div style={{ marginTop: 4, fontSize: 12, color: "var(--muted)" }}>{subtitle}</div> : null}
        </div>
        {actions}
      </div>

      <div
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: aside ? "minmax(0, 1fr) 320px" : "1fr",
          alignItems: "start",
        }}
      >
        <div style={{ border: "1px solid var(--line)", borderRadius: 0, padding: 16, background: "var(--surface)" }}>{children}</div>
        {aside ? <div>{aside}</div> : null}
      </div>
    </div>
  );
};
