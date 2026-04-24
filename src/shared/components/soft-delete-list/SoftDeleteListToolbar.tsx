import React from "react";
import { Link } from "react-router-dom";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import type { SoftDeleteListTab } from "@/shared/components/SoftDeleteList";

type Props = Readonly<{
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  isFetching: boolean;
  onRefresh: () => void;
  sortValue: string;
  sortOptions: ReadonlyArray<Readonly<{ label: string; value: string }>>;
  onSortChange: (value: string) => void;
  tab: SoftDeleteListTab;
  onTabChange: (tab: SoftDeleteListTab) => void;
  canSeeDeletedTab: boolean;
  createHref?: string;
  createLabel: string;
  canCreate?: boolean;
}>;

export const SoftDeleteListToolbar: React.FC<Props> = ({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  isFetching,
  onRefresh,
  sortValue,
  sortOptions,
  onSortChange,
  tab,
  onTabChange,
  canSeeDeletedTab,
  createHref,
  createLabel,
  canCreate,
}) => (
  <div className="flex flex-col sm:flex-row items-center justify-between py-1 gap-4">
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <Input
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-10 w-full bg-white sm:max-w-sm"
      />
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-white border-none hover:bg-slate-100"
        onClick={onRefresh}
        disabled={isFetching}
      >
        {isFetching ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={16} />}
      </Button>
      {sortOptions.length > 0 ? (
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-9 rounded-md border border-[var(--line)] bg-white px-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)]"
        >
          <option value="">Default</option>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : null}
      <Button onClick={() => onTabChange("active")} variant={tab === "active" ? "default" : "outline"}>Active</Button>
      {canSeeDeletedTab ? (
        <Button
          onClick={() => onTabChange("deleted")}
          variant="outline"
          className={tab === "deleted" ? "border-rose-200 bg-rose-50 text-rose-700" : "text-rose-600"}
        >
          <Trash2 size={14} /> <span className="ml-1">Deleted</span>
        </Button>
      ) : null}
      {canCreate !== false && createHref ? (
        <Link to={createHref} className="inline-flex items-center">
          <Button>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20"><Plus size={13} /></span>
              {createLabel}
            </span>
          </Button>
        </Link>
      ) : null}
    </div>
  </div>
);
