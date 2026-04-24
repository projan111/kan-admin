import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type Props = Readonly<{
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}>;

export const SoftDeleteListPagination: React.FC<Props> = ({ page, totalPages, onPageChange }) => (
  <div className="flex items-center justify-end space-x-2 py-4">
    <Button type="button" variant="outline" size="icon" disabled={page <= 1} onClick={() => onPageChange(1)}>
      <ChevronLeft size={14} /><ChevronLeft size={14} className="-ml-2" />
    </Button>
    <Button type="button" variant="outline" size="icon" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
      <ChevronLeft size={14} />
    </Button>
    <span className="text-sm text-[var(--muted)]">{page}/{Math.max(1, totalPages)}</span>
    <Button type="button" variant="outline" size="icon" disabled={page >= totalPages} onClick={() => onPageChange(Math.min(totalPages, page + 1))}>
      <ChevronRight size={14} />
    </Button>
    <Button type="button" variant="outline" size="icon" disabled={page >= totalPages} onClick={() => onPageChange(totalPages)}>
      <ChevronRight size={14} /><ChevronRight size={14} className="-ml-2" />
    </Button>
  </div>
);
