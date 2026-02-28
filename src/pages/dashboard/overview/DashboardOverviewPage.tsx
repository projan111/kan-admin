import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { ecommerceModules } from "@/app/config/ecommerceModules";
import { DataTable } from "@/shared/components/dashboard/DataTable";
import { Sparkline } from "@/shared/components/charts/Sparkline";

const moduleSignals = [88, 76, 69, 92, 81, 67, 73, 78, 70, 85, 61, 74, 64, 72, 87, 66, 59, 54, 63, 52, 58, 60, 57, 62];

export const DashboardOverviewPage: React.FC = () => {
  const operational = ecommerceModules.filter((m) => m.key !== "overview");

  const rows = operational.map((module, index) => ({
    module: module.label,
    section: module.section,
    readiness: moduleSignals[index % moduleSignals.length],
    trend: [
      Math.max(30, moduleSignals[(index + 3) % moduleSignals.length] - 7),
      moduleSignals[(index + 6) % moduleSignals.length],
      Math.min(98, moduleSignals[index % moduleSignals.length] + 3),
      moduleSignals[(index + 9) % moduleSignals.length],
    ],
    path: module.path,
  }));

  const avgReadiness = Math.round(rows.reduce((acc, row) => acc + row.readiness, 0) / Math.max(1, rows.length));

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/70 bg-gradient-to-br from-[#0f5bd8] via-[#0a43a4] to-[#0a376f] p-5 text-white shadow-[var(--panel-shadow)] md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Premium E-Commerce Command Center</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight md:text-3xl">Enterprise Module Architecture</h2>
            <p className="mt-1 text-sm text-white/85">Products, orders, customers, inventory, finance, logistics, content, and system controls in one scalable dashboard.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-white/16 px-3 py-2 text-sm font-semibold">
            <TrendingUp size={16} /> {operational.length} active modules
          </div>
        </div>
        <div className="mt-4 text-xs uppercase tracking-[0.12em] text-white/80">{avgReadiness}% baseline readiness for implementation rollout</div>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {operational.slice(0, 9).map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.key} to={module.path} className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[var(--card-shadow)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(15,32,64,0.14)]">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-strong)] text-white">
                  <Icon size={18} />
                </span>
                <h3 className="text-sm font-bold text-[var(--text)]">{module.label}</h3>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">{module.description}</p>
            </Link>
          );
        })}
      </section>

      <DataTable
        title="Implementation Matrix"
        columns={[
          { key: "module", title: "Module", render: (r) => <Link className="font-semibold text-[var(--primary)]" to={r.path}>{r.module}</Link> },
          { key: "section", title: "Domain", render: (r) => r.section },
          { key: "readiness", title: "Readiness", render: (r) => `${r.readiness}%` },
          { key: "trend", title: "Trend", render: (r) => <div className="w-28"><Sparkline values={r.trend} /></div> },
        ]}
        rows={rows}
      />
    </div>
  );
};
