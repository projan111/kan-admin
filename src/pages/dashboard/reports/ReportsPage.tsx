import React from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { readReportRecords } from "./reportsData";

const statusClassMap: Readonly<Record<string, string>> = {
  Ready: "bg-[#eefaf5] text-[#0f7a58]",
  Draft: "bg-[#f5f5f7] text-[#4b5563]",
};

export const ReportsPage: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const reports = React.useMemo(() => readReportRecords(), []);

  const filteredReports = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return reports;

    return reports.filter((report) =>
      [report.title, report.category, report.description, report.status].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [reports, search]);

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-(--text)">Reports</h1>
          <p className="mt-1 max-w-2xl text-sm text-(--muted)">
            Revenue, inventory, customer, and catalog reporting surfaces with detail views for operational drill-down.
          </p>
        </div>
        <Button variant="outline">
          <Download size={14} />
          Export Snapshot
        </Button>
      </section>

      <section className="rounded-[16px] border border-(--line) bg-white p-4">
        <Input
          placeholder="Search report, category, status..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {filteredReports.map((report) => (
          <Link
            key={report.id}
            to={`/dashboard/reports/${report.id}`}
            className="rounded-[18px] border border-(--line) bg-white p-5 transition-colors hover:bg-[#fafafc]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-(--muted)">{report.category}</p>
                <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-(--text)">{report.title}</h2>
                <p className="mt-2 text-sm leading-6 text-(--muted)">{report.description}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClassMap[report.status] ?? statusClassMap.Ready}`}>
                {report.status}
              </span>
            </div>
            <div className="mt-5 flex items-end justify-between gap-4 rounded-[14px] bg-[#f5f5f7] px-4 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-(--muted)">Primary Metric</p>
                <p className="mt-2 text-[24px] font-semibold text-(--text)">{report.value}</p>
              </div>
              <p className="text-sm font-medium text-[#0066cc]">{report.trend}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};
