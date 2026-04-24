import React from "react";
import { Calendar, Clock, Download, Eye } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type SaleStatus = "Completed" | "Pending" | "In Progress" | "Cancelled";

type SaleRow = Readonly<{
  name: string;
  date: string;
  price: string;
  category: string;
  product: string;
  city: string;
  status: SaleStatus;
}>;

const statusDot: Record<SaleStatus, string> = {
  Completed: "bg-[#22c55e]",
  Pending: "bg-[#f59e0b]",
  "In Progress": "bg-[#3b82f6]",
  Cancelled: "bg-[#ef4444]",
};

const statusLabel: Record<SaleStatus, string> = {
  Completed: "text-[#15803d]",
  Pending: "text-[#a16207]",
  "In Progress": "text-[#1d4ed8]",
  Cancelled: "text-[#b91c1c]",
};

const statCards = [
  { label: "Revenue", value: "$124,542", change: "+41% from last month", positive: true },
  { label: "Total Sales", value: "12,562", change: "+41% from last month", positive: true },
  { label: "Total Orders", value: "7,532", change: "-50% from last month", positive: false },
  { label: "Profit", value: "$60,652", change: "+41% from last month", positive: true },
] as const;

const barValues = [20, 65, 80, 100, 15, 140, 190, 110, 50, 200, 160];
const barDateLabels = ["01 July", "02 July", "03 July", "04 July", "05 July", "06 July", "07 July"];
const lineValues = [80, 40, 90, 60, 100, 50, 80, 120, 90, 150, 200];

const recentSales: ReadonlyArray<SaleRow> = [
  { name: "Savannah Nguyen", date: "07/05/2025", price: "$25.00", category: "Clothes", product: "Lc Waikiki Jean cargo fille avec taille", city: "Rabat", status: "Completed" },
  { name: "Jerome Bell", date: "07/05/2025", price: "$25.00", category: "Shoes", product: "Lc Waikiki Jean cargo fille avec taille", city: "Rabat", status: "Pending" },
  { name: "Darlene Robertson", date: "07/05/2025", price: "$25.00", category: "Clothes", product: "Lc Waikiki Jean cargo fille avec taille", city: "Rabat", status: "In Progress" },
  { name: "Cody Fisher", date: "07/05/2025", price: "$25.00", category: "Clothes", product: "Lc Waikiki Jean cargo fille avec taille", city: "Rabat", status: "Cancelled" },
];

const tabs = ["All tasks", "Completed", "In Progress", "Pending Approval", "Cancelled"] as const;
type Tab = (typeof tabs)[number];

const BarChart: React.FC = () => {
  const max = Math.max(...barValues);
  const W = 300;
  const H = 140;
  const barW = 16;
  const spacing = (W - barValues.length * barW) / (barValues.length + 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }} preserveAspectRatio="none">
      {barValues.map((v, i) => {
        const barH = Math.max(4, (v / max) * (H - 12));
        const x = spacing + i * (barW + spacing);
        const y = H - barH;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={barH}
            rx={4}
            fill={v === max ? "var(--primary)" : "#c7d2fe"}
          />
        );
      })}
    </svg>
  );
};

const LineChart: React.FC = () => {
  const min = Math.min(...lineValues);
  const max = Math.max(...lineValues);
  const range = Math.max(1, max - min);
  const W = 300;
  const H = 110;
  const pad = 8;

  const pts = lineValues.map((v, i): [number, number] => [
    (i / (lineValues.length - 1)) * W,
    H - pad - ((v - min) / range) * (H - pad * 2),
  ]);

  const lineD = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaD = `${lineD} L${W},${H} L0,${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#lineAreaGrad)" />
      <path d={lineD} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="white" stroke="var(--primary)" strokeWidth="1.5" />
      ))}
    </svg>
  );
};

export const DashboardOverviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<Tab>("All tasks");

  const filteredSales = recentSales.filter((row) => {
    if (activeTab === "All tasks") return true;
    if (activeTab === "Pending Approval") return row.status === "Pending";
    return row.status === (activeTab as SaleStatus);
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-(--text)">Overview</h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-(--muted)">06 Oct 2025 – 07 Oct 2025</span>
          <Button variant="outline" size="sm">
            <Calendar size={13} />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm">
            <Download size={13} />
            Export
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {statCards.map((stat) => (
          <article key={stat.label} className="rounded-[12px] border border-(--line) bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-medium text-(--text)">{stat.label}</p>
              <Clock size={14} className="text-(--muted)" />
            </div>
            <div className="mt-3 border-t border-(--line) pt-3">
              <p className="text-[22px] font-semibold tracking-[-0.03em] text-(--text)">{stat.value}</p>
              <p className={`mt-1 text-[12px] font-medium ${stat.positive ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                {stat.change}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-2">
        {/* Bar Chart */}
        <div className="rounded-[12px] border border-(--line) bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-medium text-(--muted)">Total sales</p>
              <p className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-(--text)">1,525</p>
              <p className="text-[12px] font-medium text-[#16a34a]">+20.1% from last month</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">
              <Calendar size={13} />
              Last 30 days
            </Button>
          </div>
          <div className="mt-4">
            <BarChart />
            <div className="mt-1 flex justify-between px-1">
              {barDateLabels.map((d) => (
                <span key={d} className="text-[9px] text-(--muted)">{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="rounded-[12px] border border-(--line) bg-white p-5">
          <div>
            <p className="text-[13px] font-medium text-(--muted)">Total Revenue</p>
            <p className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-(--text)">$20,462.89</p>
            <p className="text-[12px] font-medium text-[#16a34a]">+30.1% from last month</p>
          </div>
          <div className="mt-5">
            <LineChart />
          </div>
        </div>
      </div>

      {/* Last Sales */}
      <div className="rounded-[12px] border border-(--line) bg-white">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--line) px-5 py-4">
          <h2 className="text-[16px] font-semibold text-(--text)">Last sales</h2>
          <div className="flex items-center gap-2">
            <button type="button" className="flex items-center gap-1.5 text-[13px] font-medium text-[#0066cc] hover:underline">
              <Eye size={13} />
              View all
            </button>
            <Button variant="outline" size="sm">
              <Calendar size={13} />
              Last 30 days
            </Button>
            <Button variant="outline" size="sm">
              <Download size={13} />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-0 border-b border-(--line) px-5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative flex items-center gap-1.5 px-3 py-3 text-[13px] font-medium transition-colors ${
                activeTab === tab
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:content-['']"
                  : "text-(--muted) hover:text-(--text)"
              }`}
            >
              {tab}
              {tab === "Pending Approval" ? (
                <span className="rounded-[4px] bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">2</span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-(--line)">
                {["Client Name", "Data %", "Price", "Category", "Product", "City", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-(--muted)">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-(--muted)">
                    No records found.
                  </td>
                </tr>
              ) : null}
              {filteredSales.map((row) => (
                <tr key={`${row.name}-${row.date}-${row.status}`} className="border-b border-(--line) last:border-0 hover:bg-(--surface-soft)">
                  <td className="px-5 py-3 font-medium text-(--text)">{row.name}</td>
                  <td className="px-5 py-3 text-(--muted)">{row.date}</td>
                  <td className="px-5 py-3 font-medium text-(--text)">{row.price}</td>
                  <td className="px-5 py-3 text-(--muted)">{row.category}</td>
                  <td className="max-w-[180px] truncate px-5 py-3 text-(--muted)">{row.product}</td>
                  <td className="px-5 py-3 text-(--muted)">{row.city}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot[row.status]}`} />
                      <span className={`font-medium ${statusLabel[row.status]}`}>{row.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-1 px-5 py-3">
          {(["«", "‹", "1", "›", "»"] as const).map((label, i) => (
            <button
              key={label}
              type="button"
              className={`grid h-8 w-8 place-items-center rounded-[6px] border text-[13px] transition-colors ${
                label === "1"
                  ? "border-primary bg-primary font-semibold text-white"
                  : "border-(--line) text-(--muted) hover:bg-(--surface-soft)"
              }`}
              aria-label={["First", "Previous", "Page 1", "Next", "Last"][i]}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
