import React from "react";
import { Button } from "@/shared/components/ui/button";

type Props = Readonly<{
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}>;

export const PaginationBar: React.FC<Props> = ({ page, totalPages, onPrev, onNext }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: 12, borderTop: "1px solid var(--line)", background: "var(--surface-2)" }}>
      <Button type="button" variant="outline" onClick={onPrev} disabled={page <= 1}>
        Prev
      </Button>

      <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>
        Page {page} / {totalPages}
      </div>

      <Button type="button" variant="outline" onClick={onNext} disabled={page >= totalPages}>
        Next
      </Button>
    </div>
  );
};
