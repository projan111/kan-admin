import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Boxes,
  ClipboardList,
  FileClock,
  FileSearch,
  LayoutDashboard,
  MessageCircleQuestion,
  Percent,
  Rss,
  SearchCheck,
  Send,
  ShieldUser,
  ShoppingCart,
  Star,
  TicketPercent,
  Truck,
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
  shortcut?: string;
}>;

export const ecommerceModules: ReadonlyArray<EcommerceModule> = [
  { key: "overview", label: "Dashboard", path: "/dashboard", section: "Main", description: "KPI cards, latest orders, low stock, unread inquiries, and recent activity.", icon: LayoutDashboard, shortcut: "D" },

  { key: "users", label: "Users", path: "/dashboard/users", section: "Main", description: "Admin users, role assignment, permissions, and soft-delete visibility.", icon: ShieldUser, shortcut: "U" },

  { key: "customers", label: "Customers", path: "/dashboard/customers", section: "Main", description: "Customer profiles, verification, order history, and wishlist context.", icon: Users, shortcut: "C" },

  { key: "categories", label: "Categories", path: "/dashboard/categories", section: "Products", description: "Category CRUD, subcategory CRUD, and slug management.", icon: ClipboardList },

  { key: "inventory", label: "Inventory", path: "/dashboard/inventory", section: "Products", description: "Variant-aware stock levels, reserves, adjustments, and low-stock monitoring.", icon: Boxes, shortcut: "I" },

  { key: "orders", label: "Orders", path: "/dashboard/orders", section: "Sales", description: "Order list, status updates, totals, and customer linkage.", icon: ShoppingCart, shortcut: "O" },
  { key: "carts", label: "Carts", path: "/dashboard/carts", section: "Sales", description: "Active carts, abandoned carts, and line-item visibility.", icon: ShoppingCart },
  { key: "wishlists", label: "Wishlists", path: "/dashboard/wishlists", section: "Sales", description: "Wishlist viewing by customer with product and variant mapping.", icon: Star },
  { key: "payments", label: "Payments", path: "/dashboard/payments", section: "Sales", description: "Payment status tracking, transaction lookup, and method filters.", icon: Wallet },
  { key: "coupons", label: "Coupons", path: "/dashboard/coupons", section: "Sales", description: "Coupon CRUD, activation windows, and usage tracking.", icon: TicketPercent },
  { key: "delivery", label: "Delivery", path: "/dashboard/delivery/shipments", section: "Sales", description: "Courier config, shipment timelines, partner refs, webhook events, and API logs.", icon: Truck },

  { key: "contacts", label: "Contacts", path: "/dashboard/support/contacts", section: "Support", description: "General contact inbox with view and handled state through replies.", icon: Users },
  { key: "product-inquiries", label: "Inquiries", path: "/dashboard/support/product-inquiries", section: "Support", description: "Inbox, handled flags, and reply threads for product questions.", icon: Bell },
  { key: "site-inquiries", label: "Site Inquiries", path: "/dashboard/support/site-inquiries", section: "Support", description: "AI digital hair color and site-level inquiry inbox with notes and replies.", icon: SearchCheck },
  { key: "reviews", label: "Reviews", path: "/dashboard/reviews", section: "Support", description: "Review moderation with product and site review split.", icon: Star },
  { key: "faqs", label: "FAQs", path: "/dashboard/faqs", section: "Support", description: "FAQ CRUD with product and site FAQ split plus active toggle.", icon: MessageCircleQuestion },

  { key: "blog-posts", label: "Blog", path: "/dashboard/blog-posts", section: "Marketing", description: "Blog post CRUD and publish toggle.", icon: Rss },
  { key: "newsletter", label: "Newsletter", path: "/dashboard/newsletter", section: "Marketing", description: "Subscriber list, subscription state, and segmentation.", icon: Send },
  { key: "web-push-notifications", label: "Notifications", path: "/dashboard/web-push-notifications", section: "Marketing", description: "Compose/send queue list, delivery status, and failure diagnostics.", icon: Bell },
  { key: "email-campaigns", label: "Campaigns", path: "/dashboard/email-campaigns", section: "Marketing", description: "Campaign CRUD, recipients, queue status, and email logs.", icon: Percent },

  { key: "activity-logs", label: "Activity", path: "/dashboard/activity-logs", section: "Reports", description: "User and customer activity timeline with filters.", icon: FileClock, shortcut: "A" },
  { key: "audit-logs", label: "Audit", path: "/dashboard/audit-logs", section: "Reports", description: "Admin change trail by entity and actor.", icon: FileSearch },
];

export const ecommerceSidebarOrder: ReadonlyArray<string> = [
  "Main",
  "Products",
  "Sales",
  "Support",
  "Marketing",
  "Reports",
];
