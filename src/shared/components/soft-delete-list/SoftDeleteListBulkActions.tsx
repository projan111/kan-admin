import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { SoftDeleteListTab } from "@/shared/components/SoftDeleteList";

type Props = Readonly<{
  selectedCount: number;
  tab: SoftDeleteListTab;
  canDelete?: boolean;
  canRecover?: boolean;
  canDestroy?: boolean;
  deletePending: boolean;
  recoverPending: boolean;
  destroyPending: boolean;
  onClear: () => void;
  onBulkDelete: () => void;
  onBulkRecover: () => void;
  onBulkDestroy: () => void;
}>;

export const SoftDeleteListBulkActions: React.FC<Props> = ({
  selectedCount,
  tab,
  canDelete,
  canRecover,
  canDestroy,
  deletePending,
  recoverPending,
  destroyPending,
  onClear,
  onBulkDelete,
  onBulkRecover,
  onBulkDestroy,
}) => {
  if (selectedCount <= 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-600">{selectedCount} selected</span>
      <Button variant="outline" size="sm" onClick={onClear}>Clear</Button>
      {tab === "active" ? (
        canDelete === false ? null : (
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            disabled={deletePending}
            className="outline-1 outline-red-500"
          >
            <Trash2 size={14} /><span className="ml-1">Delete Selected</span>
          </Button>
        )
      ) : (
        <>
          {canRecover === false ? null : (
            <Button variant="outline" size="sm" onClick={onBulkRecover} disabled={recoverPending}>
              Recover Selected
            </Button>
          )}
          {canDestroy === false ? null : (
            <Button variant="destructive" size="sm" onClick={onBulkDestroy} disabled={destroyPending}>
              Destroy Selected
            </Button>
          )}
        </>
      )}
    </div>
  );
};
