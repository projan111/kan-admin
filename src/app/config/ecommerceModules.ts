import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  BarChart3,
  Bell,
  Boxes,
  Brain,
  ChartSpline,
  ClipboardList,
  CreditCard,
  FileClock,
  Gift,
  Globe2,
  LayoutDashboard,
  Package,
  Percent,
  ReceiptText,
  Settings,
  ShieldUser,
  ShoppingCart,
  Store,
  Tag,
  TicketPercent,
  Truck,
  Undo2,
  Users,
  Wallet,
} from "lucide-react";

export type EcommerceModule = Readonly<{
  key: string;
  label: string;
  path: string;
  section: string;
  description: string;
  icon: LucideIcon;
}>;

export const ecommerceModules: ReadonlyArray<EcommerceModule> = [
  { key: "overview", label: "Dashboard", path: "/dashboard", section: "Dashboard", description: "Revenue, conversion, traffic and live performance overview.", icon: LayoutDashboard },

  { key: "products", label: "Products", path: "/dashboard/products", section: "Core", description: "Catalog, variants, categories, media, SEO and bulk operations.", icon: Package },
  { key: "orders", label: "Orders", path: "/dashboard/orders", section: "Core", description: "Order lifecycle, payment states, refunds and invoices.", icon: ShoppingCart },
  { key: "customers", label: "Customers", path: "/dashboard/customers", section: "Core", description: "Customer profiles, segmentation, LTV and order history.", icon: Users },
  { key: "inventory", label: "Inventory", path: "/dashboard/inventory", section: "Core", description: "Stock levels, warehouses, movements and supplier tracking.", icon: Boxes },

  { key: "payments", label: "Payments", path: "/dashboard/payments", section: "Finance", description: "Gateway transactions, failures and refund records.", icon: CreditCard },
  { key: "reports", label: "Reports", path: "/dashboard/reports", section: "Finance", description: "Sales, tax, margin and performance exports.", icon: BarChart3 },
  { key: "taxes", label: "Tax", path: "/dashboard/tax", section: "Finance", description: "Tax regions, VAT/GST and auto tax calculations.", icon: ReceiptText },

  { key: "discounts", label: "Discounts", path: "/dashboard/discounts", section: "Marketing", description: "Coupon campaigns, usage tracking and auto rules.", icon: TicketPercent },
  { key: "campaigns", label: "Email/SMS", path: "/dashboard/campaigns", section: "Marketing", description: "Campaign builder, templates and cart recovery automation.", icon: Percent },
  { key: "loyalty", label: "Loyalty", path: "/dashboard/loyalty", section: "Marketing", description: "Points, rewards and referral management.", icon: Gift },
  { key: "reviews", label: "Reviews", path: "/dashboard/reviews", section: "Marketing", description: "Moderation, replies and rating analytics.", icon: Tag },

  { key: "shipping", label: "Shipping", path: "/dashboard/shipping", section: "Logistics", description: "Zones, rates, carriers and delivery tracking.", icon: Truck },
  { key: "returns", label: "Returns & RMA", path: "/dashboard/returns", section: "Logistics", description: "Return approvals, workflows and refund processing.", icon: Undo2 },

  { key: "cms", label: "Content", path: "/dashboard/content", section: "Website", description: "Homepage, banners, landing pages, blog and SEO control.", icon: ClipboardList },

  { key: "ai-insights", label: "AI Insights", path: "/dashboard/ai-insights", section: "Advanced", description: "Demand forecasting and sales prediction insights.", icon: Brain },
  { key: "multi-vendor", label: "Multi-Vendor", path: "/dashboard/multi-vendor", section: "Advanced", description: "Vendor onboarding, commissions and vendor ops.", icon: Store },
  { key: "multi-store", label: "Multi-Store", path: "/dashboard/multi-store", section: "Advanced", description: "Localization, currency and country pricing.", icon: Globe2 },
  { key: "subscriptions", label: "Subscriptions", path: "/dashboard/subscriptions", section: "Advanced", description: "Recurring billing and subscription lifecycle.", icon: FileClock },
  { key: "bundle-products", label: "Bundle Products", path: "/dashboard/bundles", section: "Advanced", description: "Bundle kits and combined pricing packs.", icon: Wallet },
  { key: "marketplace", label: "Apps", path: "/dashboard/apps", section: "Advanced", description: "Plugin marketplace and platform integrations.", icon: AppWindow },

  { key: "users", label: "Users", path: "/dashboard/users", section: "Administration", description: "Admin users, RBAC, permissions and login history.", icon: ShieldUser },
  { key: "settings", label: "Settings", path: "/dashboard/settings", section: "Administration", description: "General config, currency, API keys and webhooks.", icon: Settings },
  { key: "notifications", label: "Notifications", path: "/dashboard/notifications", section: "System", description: "Order, stock and system-wide notification center.", icon: Bell },
  { key: "logs", label: "Logs", path: "/dashboard/logs", section: "System", description: "Error logs, API logs and service health monitoring.", icon: ChartSpline },
];

export const ecommerceSidebarOrder: ReadonlyArray<string> = [
  "Dashboard",
  "Core",
  "Finance",
  "Marketing",
  "Logistics",
  "Website",
  "Advanced",
  "Administration",
  "System",
];
