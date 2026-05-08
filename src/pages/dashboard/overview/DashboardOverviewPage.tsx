import React from "react";
import {
  Calendar,
  Download,
  Eye,
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type Order = Readonly<{
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  products: number;
  total: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
}>;

type Inquiry = Readonly<{
  id: string;
  customerName: string;
  email: string;
  subject: string;
  type: "Product" | "Site";
  status: "New" | "In Progress" | "Resolved";
  date: string;
}>;

const orderStatusStyles: Record<Order["status"], string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped: "bg-purple-50 text-purple-700 border-purple-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const inquiryStatusStyles: Record<Inquiry["status"], string> = {
  New: "bg-amber-50 text-amber-700 border-amber-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const recentOrders: ReadonlyArray<Order> = [
  {
    id: "1",
    orderNumber: "ORD-1001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    products: 3,
    total: "$299.99",
    status: "Processing",
    date: "May 8, 2026",
  },
  {
    id: "2",
    orderNumber: "ORD-1002",
    customerName: "Mike Chen",
    customerEmail: "mike.c@email.com",
    products: 1,
    total: "$79.99",
    status: "Shipped",
    date: "May 7, 2026",
  },
  {
    id: "3",
    orderNumber: "ORD-1003",
    customerName: "Emma Wilson",
    customerEmail: "emma.w@email.com",
    products: 5,
    total: "$459.95",
    status: "Pending",
    date: "May 8, 2026",
  },
  {
    id: "4",
    orderNumber: "ORD-1004",
    customerName: "David Brown",
    customerEmail: "david.b@email.com",
    products: 2,
    total: "$149.98",
    status: "Delivered",
    date: "May 6, 2026",
  },
  {
    id: "5",
    orderNumber: "ORD-1005",
    customerName: "Lisa Anderson",
    customerEmail: "lisa.a@email.com",
    products: 4,
    total: "$389.96",
    status: "Processing",
    date: "May 8, 2026",
  },
];

const recentInquiries: ReadonlyArray<Inquiry> = [
  {
    id: "1",
    customerName: "Alex Turner",
    email: "alex.t@email.com",
    subject: "Product availability question",
    type: "Product",
    status: "New",
    date: "May 8, 2026",
  },
  {
    id: "2",
    customerName: "Jessica Lee",
    email: "jessica.l@email.com",
    subject: "Shipping timeline inquiry",
    type: "Product",
    status: "In Progress",
    date: "May 7, 2026",
  },
  {
    id: "3",
    customerName: "Robert Kim",
    email: "robert.k@email.com",
    subject: "Website navigation issue",
    type: "Site",
    status: "New",
    date: "May 8, 2026",
  },
  {
    id: "4",
    customerName: "Maria Garcia",
    email: "maria.g@email.com",
    subject: "Product recommendation request",
    type: "Product",
    status: "Resolved",
    date: "May 6, 2026",
  },
  {
    id: "5",
    customerName: "James Wilson",
    email: "james.w@email.com",
    subject: "Return policy question",
    type: "Site",
    status: "In Progress",
    date: "May 7, 2026",
  },
];

// Updated stat cards for e-commerce
const statCards = [
  {
    label: "TOTAL ORDERS",
    value: "1,284",
    change: "+12.5% vs last month",
    positive: true,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    icon: ShoppingCart,
    iconBg: "bg-blue-100",
  },
  {
    label: "REVENUE (MTD)",
    value: "$84,200",
    change: "+18.2% vs last month",
    positive: true,
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
    icon: DollarSign,
    iconBg: "bg-emerald-100",
  },
  {
    label: "NEW CUSTOMERS",
    value: "342",
    change: "+24 this week",
    positive: true,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    icon: Users,
    iconBg: "bg-purple-100",
  },
  {
    label: "AVG ORDER VALUE",
    value: "$65.60",
    change: "+5.3% vs last month",
    positive: true,
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600",
    icon: TrendingUp,
    iconBg: "bg-cyan-100",
  },
  {
    label: "PENDING ORDERS",
    value: "28",
    change: "Needs attention",
    positive: false,
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    icon: AlertCircle,
    iconBg: "bg-amber-100",
  },
  {
    label: "LOW STOCK ITEMS",
    value: "15",
    change: "Restock required",
    positive: false,
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
    icon: Package,
    iconBg: "bg-red-100",
  },
] as const;

const barValues = [20, 65, 80, 100, 15, 140, 190, 110, 50, 200, 160];
const barDateLabels = [
  "01 July",
  "02 July",
  "03 July",
  "04 July",
  "05 July",
  "06 July",
  "07 July",
];
const lineValues = [80, 40, 90, 60, 100, 50, 80, 120, 90, 150, 200];

// BarChart Component
const BarChart: React.FC = () => {
  const max = Math.max(...barValues);
  const W = 300;
  const H = 140;
  const barW = 16;
  const spacing = (W - barValues.length * barW) / (barValues.length + 1);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: 140 }}
      preserveAspectRatio="none"
    >
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

// LineChart Component
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

  const lineD = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
  const areaD = `${lineD} L${W},${H} L0,${H} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: 120 }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#lineAreaGrad)" />
      <path
        d={lineD}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {pts.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="3"
          fill="white"
          stroke="var(--primary)"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
};

// Main Dashboard Component
export const DashboardOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard Overview</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Calendar size={14} />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Download size={14} />
            Export
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className={`rounded-xl ${stat.bgColor} p-4 transition-shadow hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-zinc-900">
                    {stat.value}
                  </p>
                  <p
                    className={`mt-1 text-xs font-medium ${stat.positive ? "text-slate-600" : "text-slate-700"}`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.iconBg}`}
                >
                  <Icon size={24} className={stat.iconColor} strokeWidth={2} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-2">
        {/* Bar Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-600">Total sales</p>
              <p className="mt-1 text-3xl font-bold text-zinc-900">1,525</p>
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp size={12} />
                +20.1% from last month
              </p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 text-xs">
              <Calendar size={13} />
              Last 30 days
            </Button>
          </div>
          <div className="mt-6">
            <BarChart />
            <div className="mt-2 flex justify-between px-1">
              {barDateLabels.map((d) => (
                <span key={d} className="text-[9px] text-slate-500">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Revenue</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">
              Rs 20,462.89
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <TrendingUp size={12} />
              +30.1% from last month
            </p>
          </div>
          <div className="mt-6">
            <LineChart />
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-900">
              Recent Orders
            </h2>
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {recentOrders.length} orders
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all orders →
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Customer
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Products
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : null}
              {recentOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className="hover:bg-zinc-50 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-600">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-zinc-900">
                      {order.orderNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-zinc-900">
                        {order.customerName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {order.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-zinc-900">
                    {order.products}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-zinc-900">
                    {order.total}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${orderStatusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{order.date}</td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      size="sm"
                      className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-medium"
                    >
                      <Eye size={14} />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-900">
              Recent Inquiries
            </h2>
            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
              {recentInquiries.filter((i) => i.status === "New").length} new
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all inquiries →
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {recentInquiries.map((inquiry, idx) => (
                <tr
                  key={inquiry.id}
                  className="hover:bg-zinc-50 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-600">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-zinc-900">
                        {inquiry.customerName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {inquiry.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-900">{inquiry.subject}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        inquiry.type === "Product"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {inquiry.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${inquiryStatusStyles[inquiry.status]}`}
                    >
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{inquiry.date}</td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      size="sm"
                      className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-medium"
                    >
                      <Eye size={14} />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
