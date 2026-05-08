import React from "react";
import { Calendar, Download, Plus } from "lucide-react";

type Props = {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showDateFilter?: boolean;
  showExport?: boolean;
  onNew?: () => void;
  newButtonLabel?: string;
};

export const PageLayout: React.FC<Props> = ({
  title,
  children,
  actions,
  showDateFilter = false,
  showExport = false,
  onNew,
  newButtonLabel = "New",
}) => {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          {showDateFilter && (
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              <Calendar size={14} />
              Last 30 days
            </button>
          )}
          {showExport && (
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              <Download size={14} />
              Export
            </button>
          )}
          {onNew && (
            <button
              onClick={onNew}
              className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              <Plus size={16} />
              {newButtonLabel}
            </button>
          )}
          {actions}
        </div>
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
};
