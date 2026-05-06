import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { findReportRecord } from "./reportsData";

const toneClassMap: Readonly<Record<string, string>> = {
  positive: "bg-[#eefaf5] text-[#0f7a58]",
  warning: "bg-[#fff7e8] text-[#9a6700]",
  info: "bg-[#edf5ff] text-[#0066cc]",
};

export const ReportDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const report = React.useMemo(() => (id ? findReportRecord(id) : undefined), [id]);

  if (!report) {
    return (
      <div className="rounded-[16px] border border-(--line) bg-white p-6">
        <h1 className="text-[24px] font-semibold text-(--text)">Report not found</h1>
        <Button variant="ghost" className="mt-3 px-0" onClick={() => navigate("/dashboard/reports")}>
          <ArrowLeft size={15} />
          Back To Reports
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button variant="ghost" className="mb-2 px-0" onClick={() => navigate("/dashboard/reports")}>
            <ArrowLeft size={15} />
            Back To Reports
          </Button>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-(--muted)">{report.category}</p>
          <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-(--text)">{report.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-(--muted)">{report.description}</p>
        </div>
        <Button variant="outline">
          <Download size={14} />
          Export Report
        </Button>
      </div>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="rounded-[16px] border border-(--line) bg-white p-5">
            <h2 className="text-[16px] font-semibold text-(--text)">Summary</h2>
            <div className="mt-4 rounded-[14px] bg-[#f5f5f7] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-(--muted)">Primary Value</p>
              <p className="mt-2 text-[30px] font-semibold text-(--text)">{report.value}</p>
              <p className="mt-2 text-sm font-medium text-[#0066cc]">{report.trend}</p>
            </div>
          </div>

          <div className="rounded-[16px] border border-(--line) bg-white p-5">
            <h2 className="text-[16px] font-semibold text-(--text)">Insights</h2>
            <div className="mt-4 space-y-3">
              {report.insights.map((insight) => (
                <div key={insight.title} className="rounded-[14px] border border-(--line) p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-(--text)">{insight.title}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${toneClassMap[insight.tone] ?? toneClassMap.info}`}>
                      {insight.tone}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-(--muted)">{insight.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[16px] border border-(--line) bg-white p-5">
          <h2 className="text-[16px] font-semibold text-(--text)">Metrics Breakdown</h2>
          <div className="mt-4 space-y-3">
            {report.metrics.map((metric) => (
              <div key={metric.label} className="rounded-[14px] bg-[#f5f5f7] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-(--muted)">{metric.label}</p>
                    <p className="mt-1 text-sm text-(--muted)">{metric.note}</p>
                  </div>
                  <p className="text-[20px] font-semibold text-(--text)">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
