import React from "react";
import { ArrowRight, ChevronRight, Droplets, Package, Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles, Truck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { DataTable } from "@/shared/components/dashboard/DataTable";

type SpotlightMetric = Readonly<{
  label: string;
  value: string;
  hint: string;
}>;

type MerchandisingCard = Readonly<{
  title: string;
  subtitle: string;
  value: string;
  accent: string;
}>;

type OrderRow = Readonly<{
  id: string;
  customer: string;
  product: string;
  total: string;
  status: "Packed" | "Delivered" | "Pending" | "Returned";
  date: string;
}>;

const spotlightMetrics: ReadonlyArray<SpotlightMetric> = [
  { label: "Net Revenue", value: "$689,372", hint: "+18.6% vs last month" },
  { label: "Orders", value: "2,438", hint: "124 in the last 24 hours" },
  { label: "Conversion", value: "3.84%", hint: "Beauty routine bundles leading" },
];

const merchandisingCards: ReadonlyArray<MerchandisingCard> = [
  { title: "Hero Product", subtitle: "Radiance Vitamin C Serum", value: "$84.9K", accent: "from-[#fff3d6] to-[#ffe7a7]" },
  { title: "Fastest Growth", subtitle: "Velvet Matte Lip Kit", value: "+26%", accent: "from-[#ffe5ec] to-[#ffd1df]" },
  { title: "Restock Priority", subtitle: "Dewdrop Gel Cream", value: "42 SKUs", accent: "from-[#e8f4ff] to-[#d7ebff]" },
];

const operations = [
  { title: "Catalog Ready", value: "8,240", description: "Live sellable beauty SKUs", icon: Package },
  { title: "Fulfillment", value: "1,402 / 1,800", description: "Orders packed and handed to carriers", icon: Truck },
  { title: "Trust Signals", value: "4.8/5", description: "Average review score across top lines", icon: ShieldCheck },
  { title: "Seasonal Demand", value: "Glow + SPF", description: "Highest intent collection this week", icon: Sparkles },
] as const;

const recentOrders: ReadonlyArray<OrderRow> = [
  { id: "ORD-10482", customer: "Ava Johnson", product: "Radiance Vitamin C Serum", total: "$48.00", status: "Delivered", date: "24 Apr, 2026 09:15 AM" },
  { id: "ORD-10481", customer: "Noah Smith", product: "Velvet Matte Lip Kit", total: "$36.00", status: "Packed", date: "24 Apr, 2026 08:42 AM" },
  { id: "ORD-10480", customer: "Sophia Williams", product: "Botanical Cleansing Balm", total: "$42.00", status: "Pending", date: "23 Apr, 2026 06:18 PM" },
  { id: "ORD-10479", customer: "Liam Brown", product: "Silk Repair Shampoo", total: "$28.00", status: "Delivered", date: "23 Apr, 2026 03:07 PM" },
  { id: "ORD-10478", customer: "Emma Davis", product: "Dewdrop Gel Cream", total: "$52.00", status: "Returned", date: "23 Apr, 2026 12:31 PM" },
];

const statusTone: Record<OrderRow["status"], string> = {
  Packed: "bg-[#e8f4ff] text-[#0071e3]",
  Delivered: "bg-[#ebfbf2] text-[#1f8f5f]",
  Pending: "bg-[#fff6de] text-[#b78103]",
  Returned: "bg-[#fff0f0] text-[#d14343]",
};

export const DashboardOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-black px-6 py-7 text-white shadow-[0_18px_40px_rgba(0,0,0,0.2)] md:px-8 md:py-9">
        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/58">Beauty Commerce Command</p>
            <h1 className="mt-3 max-w-3xl text-[30px] font-semibold tracking-[-0.04em] text-white md:text-[38px]">
              A quieter dashboard for faster merchandising decisions.
            </h1>
            <p className="mt-4 max-w-2xl text-[14px] leading-6 text-white/72">
              Revenue, order flow, replenishment pressure, and launch momentum across your skincare, makeup, and haircare catalog.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full border-0 bg-[#0071e3] px-5 hover:bg-[#0066cc]">
                Open Orders
                <ArrowRight size={16} />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full border-white/18 bg-white/6 px-5 text-white hover:bg-white/10">
                Explore Catalog
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {spotlightMetrics.map((metric) => (
              <article key={metric.label} className="rounded-[22px] border border-white/10 bg-white/6 px-5 py-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">{metric.label}</p>
                <p className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-white">{metric.value}</p>
                <p className="mt-1 text-[13px] text-white/62">{metric.hint}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[28px] bg-[#f5f5f7] px-5 py-5 md:px-6 md:py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6e6e73]">Merchandising</p>
            <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#1d1d1f]">This week’s standout beauty lines.</h2>
          </div>
          <button className="inline-flex items-center gap-1 text-[14px] font-medium text-[#0066cc]">
            View full performance
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {merchandisingCards.map((card) => (
            <article
              key={card.title}
              className={`overflow-hidden rounded-[24px] bg-gradient-to-br ${card.accent} px-5 py-6`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6e6e73]">{card.title}</p>
                  <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.03em] text-[#1d1d1f]">{card.subtitle}</h3>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/70 text-[#1d1d1f]">
                  {card.title === "Hero Product" ? <Droplets size={20} /> : card.title === "Fastest Growth" ? <ShoppingBag size={20} /> : <Package size={20} />}
                </div>
              </div>
              <p className="mt-8 text-[26px] font-semibold tracking-[-0.04em] text-[#1d1d1f]">{card.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {operations.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-[22px] border border-[#d2d2d7] bg-white px-5 py-5 shadow-[0_8px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6e6e73]">{item.title}</p>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f5f5f7] text-[#1d1d1f]">
                    <Icon size={18} />
                  </span>
                </div>
                <p className="mt-4 text-[22px] font-semibold tracking-[-0.03em] text-[#1d1d1f]">{item.value}</p>
                <p className="mt-2 text-[14px] leading-6 text-[#6e6e73]">{item.description}</p>
              </article>
            );
          })}
        </div>

        <DataTable
          title="Recent Orders"
          description="Dense operational feed for beauty-commerce order handling."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e73]" />
                <input
                  defaultValue=""
                  placeholder="Search orders"
                  className="h-10 rounded-full border border-[#d2d2d7] bg-white pl-9 pr-4 text-sm text-[#1d1d1f] outline-none focus:border-[#0071e3]"
                />
              </label>
              <Button variant="outline" className="rounded-full border-[#d2d2d7] bg-white">
                <SlidersHorizontal size={15} />
                Filter
              </Button>
            </div>
          }
          columns={[
            {
              key: "id",
              title: "Order",
              render: (row) => <span className="font-semibold text-[#1d1d1f]">{row.id}</span>,
            },
            {
              key: "customer",
              title: "Customer",
              render: (row) => (
                <div>
                  <div className="font-medium text-[#1d1d1f]">{row.customer}</div>
                  <div className="text-[13px] text-[#6e6e73]">{row.product}</div>
                </div>
              ),
            },
            {
              key: "total",
              title: "Total",
              render: (row) => <span className="font-medium text-[#1d1d1f]">{row.total}</span>,
            },
            {
              key: "status",
              title: "Status",
              render: (row) => <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${statusTone[row.status]}`}>{row.status}</span>,
            },
            {
              key: "date",
              title: "Date",
              render: (row) => <span className="text-[13px] text-[#6e6e73]">{row.date}</span>,
            },
          ]}
          rows={recentOrders}
        />
      </section>
    </div>
  );
};
