import type React from "react";

export const ui = {
  btnPrimary: {
    padding: "8px 12px",
    border: "1px solid var(--primary)",
    background: "linear-gradient(180deg, var(--primary) 0%, var(--primary-strong) 100%)",
    color: "#fff",
    cursor: "pointer",
    borderRadius: 999,
  } satisfies React.CSSProperties,
  btnSecondary: {
    padding: "8px 12px",
    border: "1px solid var(--line)",
    background: "#fff",
    color: "var(--text)",
    cursor: "pointer",
    borderRadius: 999,
  } satisfies React.CSSProperties,
  btnDanger: {
    padding: "8px 12px",
    border: "1px solid #fecaca",
    background: "#fff1f2",
    color: "#be123c",
    cursor: "pointer",
    borderRadius: 999,
  } satisfies React.CSSProperties,
  btnSuccess: {
    padding: "8px 12px",
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#166534",
    cursor: "pointer",
    borderRadius: 999,
  } satisfies React.CSSProperties,
};
