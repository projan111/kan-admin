import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Boxes,
  ClipboardList,
  FileClock,
  FileSearch,
  Globe2,
  Image,
  LayoutDashboard,
  MessageCircleQuestion,
  Megaphone,
  NotebookTabs,
  Package,
  Percent,
  Rss,
  SearchCheck,
  Send,
  ShieldUser,
  ShoppingCart,
  Star,
  // Tag,
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
}>;

export const ecommerceModules: ReadonlyArray<EcommerceModule> = [
  { key: "overview", label: "Overview", path: "/dashboard", section: "Dashboard", description: "KPI cards, latest orders, low stock, unread inquiries, and recent activity.", icon: LayoutDashboard },

  { key: "users", label: "Admin Users", path: "/dashboard/users", section: "Access Control", description: "Admin users, role assignment, permissions, and soft-delete visibility.", icon: ShieldUser },

  { key: "customers", label: "Customers", path: "/dashboard/customers", section: "Customers", description: "Customer profiles, verification, order history, and wishlist context.", icon: Users },

  { key: "categories", label: "Categories", path: "/dashboard/categories", section: "Catalog", description: "Category CRUD, subcategory CRUD, and slug management.", icon: ClipboardList },
  { key: "products", label: "Products", path: "/dashboard/products", section: "Catalog", description: "Product CRUD, cover and hover images, pricing, and publish-ready sections.", icon: Package },
  { key: "product-variants", label: "Product Variants", path: "/dashboard/product-variants", section: "Catalog", description: "Variant CRUD, default variant switching, and variant pricing.", icon: Package },
  { key: "product-attributes-tags", label: "Product Attributes And Tags", path: "/dashboard/product-attributes-tags", section: "Catalog", description: "Attributes key-value editing and product tag management.", icon: NotebookTabs },
  { key: "product-media", label: "Product Media", path: "/dashboard/product-media", section: "Catalog", description: "Media gallery management per product.", icon: Image },
  { key: "advertisements", label: "Advertisements", path: "/dashboard/advertisements", section: "Catalog", description: "Ad slot CRUD by product, category, and subcategory target.", icon: Megaphone },

  { key: "inventory", label: "Inventory", path: "/dashboard/inventory", section: "Inventory", description: "Variant-aware stock levels, reserves, adjustments, and low-stock monitoring.", icon: Boxes },

  { key: "carts", label: "Carts", path: "/dashboard/carts", section: "Commerce", description: "Active carts, abandoned carts, and line-item visibility.", icon: ShoppingCart },
  { key: "wishlists", label: "Wishlists", path: "/dashboard/wishlists", section: "Commerce", description: "Wishlist viewing by customer with product and variant mapping.", icon: Star },
  { key: "orders", label: "Orders", path: "/dashboard/orders", section: "Commerce", description: "Order list, status updates, totals, and customer linkage.", icon: ShoppingCart },
  { key: "payments", label: "Payments", path: "/dashboard/payments", section: "Commerce", description: "Payment status tracking, transaction lookup, and method filters.", icon: Wallet },
  { key: "coupons", label: "Coupons", path: "/dashboard/coupons", section: "Commerce", description: "Coupon CRUD, activation windows, and usage tracking.", icon: TicketPercent },

  { key: "delivery", label: "Delivery", path: "/dashboard/delivery/shipments", section: "Shipping", description: "Courier config, shipment timelines, partner refs, webhook events, and API logs.", icon: Truck },

  { key: "reviews", label: "Reviews", path: "/dashboard/reviews", section: "Support", description: "Review moderation with product and site review split.", icon: Star },
  { key: "faqs", label: "FAQs", path: "/dashboard/faqs", section: "Support", description: "FAQ CRUD with product and site FAQ split plus active toggle.", icon: MessageCircleQuestion },
  { key: "product-inquiries", label: "Product Inquiries", path: "/dashboard/support/product-inquiries", section: "Support", description: "Inbox, handled flags, and reply threads for product questions.", icon: Bell },
  { key: "contacts", label: "Contacts", path: "/dashboard/support/contacts", section: "Support", description: "General contact inbox with view and handled state through replies.", icon: Users },
  { key: "site-inquiries", label: "Site Inquiries", path: "/dashboard/support/site-inquiries", section: "Support", description: "AI digital hair color and site-level inquiry inbox with notes and replies.", icon: SearchCheck },

  { key: "blog-posts", label: "Blog Posts", path: "/dashboard/blog-posts", section: "Content", description: "Blog post CRUD and publish toggle.", icon: Rss },
  { key: "seo-metadata", label: "SEO Metadata", path: "/dashboard/seo-metadata", section: "Content", description: "SEO entry CRUD, entity mapping, and slug targeting.", icon: Globe2 },

  { key: "newsletter", label: "Newsletter", path: "/dashboard/newsletter", section: "Marketing", description: "Subscriber list, subscription state, and segmentation.", icon: Send },
  { key: "web-push-subscriptions", label: "Web Push Subscriptions", path: "/dashboard/web-push-subscriptions", section: "Marketing", description: "Subscription registry with device, platform, and active state view.", icon: Bell },
  { key: "web-push-notifications", label: "Web Push Notifications", path: "/dashboard/web-push-notifications", section: "Marketing", description: "Compose/send queue list, delivery status, and failure diagnostics.", icon: Bell },
  { key: "email-campaigns", label: "Email Campaigns", path: "/dashboard/email-campaigns", section: "Marketing", description: "Campaign CRUD, recipients, queue status, and email logs.", icon: Percent },

  { key: "activity-logs", label: "Activity Logs", path: "/dashboard/activity-logs", section: "Monitoring", description: "User and customer activity timeline with filters.", icon: FileClock },
  { key: "audit-logs", label: "Audit Logs", path: "/dashboard/audit-logs", section: "Monitoring", description: "Admin change trail by entity and actor.", icon: FileSearch },
];

export const ecommerceSidebarOrder: ReadonlyArray<string> = [
  "Dashboard",
  "Access Control",
  "Customers",
  "Catalog",
  "Inventory",
  "Commerce",
  "Shipping",
  "Support",
  "Content",
  "Marketing",
  "Monitoring",
];
