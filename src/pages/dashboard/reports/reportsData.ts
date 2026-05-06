import { readCustomerRecords } from "@/pages/dashboard/customers/customerData";
import { readInventoryRecords } from "@/pages/dashboard/inventory/inventoryData";
import { readOrderRecords } from "@/pages/dashboard/orders/orderData";
import { readProductRecords } from "@/pages/dashboard/products/productData";

export type ReportMetricRow = Readonly<{
  label: string;
  value: string;
  note: string;
}>;

export type ReportInsight = Readonly<{
  title: string;
  detail: string;
  tone: "positive" | "warning" | "info";
}>;

export type ReportRecord = Readonly<{
  id: string;
  title: string;
  category: string;
  description: string;
  value: string;
  trend: string;
  status: string;
  metrics: ReadonlyArray<ReportMetricRow>;
  insights: ReadonlyArray<ReportInsight>;
}>;

const formatCurrency = (value: number) => `Rs ${value.toLocaleString()}`;

const sumOrderTotals = (totals: ReadonlyArray<string>) =>
  totals.reduce((sum, total) => sum + Number(total.replace(/[^\d.]/g, "")), 0);

export const readReportRecords = (): ReadonlyArray<ReportRecord> => {
  const orders = readOrderRecords();
  const customers = readCustomerRecords();
  const inventory = readInventoryRecords();
  const products = readProductRecords();

  const revenue = sumOrderTotals(orders.map((order) => order.total));
  const averageOrderValue = orders.length > 0 ? revenue / orders.length : 0;
  const lowStockItems = inventory.filter((item) => item.status === "Low Stock" || item.status === "Out Of Stock");
  const activeProducts = products.filter((product) => product.publishStatus === "Active");
  const vipCustomers = customers.filter((customer) => customer.segment === "VIP" || customer.segment === "Loyal");

  return [
    {
      id: "sales-performance",
      title: "Sales Performance",
      category: "Revenue",
      description: "Revenue, AOV, paid order coverage, and conversion-facing order performance.",
      value: formatCurrency(revenue),
      trend: "+12.4% vs last period",
      status: "Ready",
      metrics: [
        { label: "Gross Revenue", value: formatCurrency(revenue), note: "Derived from current seeded orders" },
        { label: "Average Order Value", value: formatCurrency(Number(averageOrderValue.toFixed(2))), note: `${orders.length} orders in sample` },
        { label: "Paid Orders", value: String(orders.filter((order) => order.paymentStatus === "Paid").length), note: "Paid or captured payment status" },
        { label: "Pending Orders", value: String(orders.filter((order) => order.status === "Pending").length), note: "Needs attention in order workflow" },
      ],
      insights: [
        { title: "Revenue concentration", detail: "Top sample orders are concentrated in skincare and face hydration lines.", tone: "info" },
        { title: "AOV opportunity", detail: "Bundle and cross-sell offers should target higher-value shipped and delivered cohorts.", tone: "positive" },
      ],
    },
    {
      id: "inventory-health",
      title: "Inventory Health",
      category: "Operations",
      description: "Low-stock risk, reserved units, and incoming inventory coverage by active sellable variants.",
      value: String(lowStockItems.length),
      trend: `${inventory.filter((item) => item.incoming > 0).length} incoming replenishments`,
      status: "Ready",
      metrics: [
        { label: "Low Stock Items", value: String(lowStockItems.length), note: "Includes out-of-stock SKUs" },
        { label: "Reserved Units", value: String(inventory.reduce((sum, item) => sum + item.reserved, 0)), note: "Held for active orders and reservations" },
        { label: "Incoming Units", value: String(inventory.reduce((sum, item) => sum + item.incoming, 0)), note: "Awaiting receipt into warehouse" },
        { label: "Healthy Variants", value: String(inventory.filter((item) => item.status === "In Stock" || item.status === "Reserved").length), note: "In stock and still sellable" },
      ],
      insights: [
        { title: "Immediate restock queue", detail: "Variants under threshold should be escalated before new campaigns push traffic into those SKUs.", tone: "warning" },
        { title: "Reserved stock load", detail: "Reserved stock is meaningful for shipped and packed order volume, especially in Warehouse C.", tone: "info" },
      ],
    },
    {
      id: "customer-value",
      title: "Customer Value",
      category: "Retention",
      description: "Segment quality, VIP concentration, and customer account posture for retention-focused reporting.",
      value: String(customers.length),
      trend: `${vipCustomers.length} high-value customers identified`,
      status: "Ready",
      metrics: [
        { label: "Customers", value: String(customers.length), note: "Current active sample customers" },
        { label: "VIP Or Loyal", value: String(vipCustomers.length), note: "High-value segments" },
        { label: "Pending Verification", value: String(customers.filter((customer) => customer.verification === "Pending").length), note: "Needs account verification follow-up" },
        { label: "At Risk Accounts", value: String(customers.filter((customer) => customer.status === "Needs Attention").length), note: "Candidate for winback or support review" },
      ],
      insights: [
        { title: "Retention priority", detail: "VIP and Loyal customers have enough density to justify segmented campaign reporting.", tone: "positive" },
        { title: "Account hygiene", detail: "Pending verification and at-risk states should be monitored in tandem with order inactivity.", tone: "warning" },
      ],
    },
    {
      id: "catalog-coverage",
      title: "Catalog Coverage",
      category: "Catalog",
      description: "Product readiness, active catalog depth, and publish-state visibility for catalog reporting.",
      value: String(activeProducts.length),
      trend: `${products.length} total products tracked`,
      status: "Ready",
      metrics: [
        { label: "Active Products", value: String(activeProducts.length), note: "PublishStatus = Active" },
        { label: "Draft Products", value: String(products.filter((product) => product.publishStatus === "Draft").length), note: "Needs merchandising completion" },
        { label: "Face Category", value: String(products.filter((product) => product.category === "Face").length), note: "Hydration and complexion lines" },
        { label: "Lips Category", value: String(products.filter((product) => product.category === "Lips").length), note: "Lip color and matte lines" },
      ],
      insights: [
        { title: "Catalog mix", detail: "Face and skincare products currently dominate the seeded dataset.", tone: "info" },
        { title: "Publish readiness", detail: "Draft products should be completed before expanding traffic acquisition campaigns.", tone: "warning" },
      ],
    },
  ];
};

export const findReportRecord = (id: string) => readReportRecords().find((report) => report.id === id);
