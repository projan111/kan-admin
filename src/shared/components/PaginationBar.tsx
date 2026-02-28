import React from "react";
import { ui } from "@/shared/styles/ui";

type Props = Readonly<{
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}>;

export const PaginationBar: React.FC<Props> = ({ page, totalPages, onPrev, onNext }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: 12, borderTop: "1px solid var(--line)", background: "var(--surface-2)" }}>
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        style={ui.btnSecondary}
      >
        Prev
      </button>

      <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>
        Page {page} / {totalPages}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        style={ui.btnSecondary}
      >
        Next
      </button>
    </div>
  );
};
