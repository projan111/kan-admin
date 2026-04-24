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
    <div
      style={{
        display: "grid",
        gap: 18,
        maxWidth: 1120,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          background: "rgba(255,255,255,0.82)",
          border: "1px solid rgba(255,255,255,0.7)",
          borderRadius: 24,
          padding: "18px 20px",
          boxShadow: "var(--card-shadow)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em", color: "var(--text)" }}>{title}</h2>
          {subtitle ? <div style={{ marginTop: 6, fontSize: 13, color: "var(--muted)" }}>{subtitle}</div> : null}
        </div>
        {actions}
      </div>

      <div
        style={{
          display: "grid",
          gap: 18,
          gridTemplateColumns: aside ? "minmax(0, 1fr) 320px" : "1fr",
          alignItems: "start",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.7)",
            borderRadius: 24,
            padding: 20,
            background: "rgba(255,255,255,0.9)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          {children}
        </div>
        {aside ? <div>{aside}</div> : null}
      </div>
    </div>
  );
};
