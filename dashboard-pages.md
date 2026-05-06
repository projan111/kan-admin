# Dashboard Pages And Modules (Frontend Design Spec)

This document defines dashboard pages/modules for the cosmetics ecommerce backend based on the current database schema.

Scope: page design and feature scope only (DB-first phase).  
Source of truth for data objects: `src/entities/*.entity.ts`.

---

## 1) Dashboard Structure

| Area | Purpose |
| --- | --- |
| Global Header | search, notifications, profile menu, quick actions |
| Left Navigation | module navigation with badge counts |
| Main Content | module page content |
| Right Drawer/Modal Layer | create/edit/detail forms |

---

## 2) Core Dashboard Pages

| Page | Module | Main Features | Main Tables |
| --- | --- | --- | --- |
| Overview | Admin Home | KPI cards, latest orders, low stock, unread inquiries, recent activity | `orders`, `inventories`, `inquiries`, `site_inquiries`, `contacts`, `user_activities` |
| Admin Users | Admin/Auth | list, create, update, soft-delete, role assignment | `users`, `auth`, `roles`, `permissions`, `user_roles`, `role_permissions`, `user_permissions` |
| Customers | Customer | list, detail drawer, status/verification, order history preview | `customers`, `customer_auth`, `customer_addresses`, `orders` |
| Categories | Catalog | category CRUD, subcategory CRUD, slug management | `categories`, `subcategories` |
| Products | Catalog | product CRUD, cover/hover images, pricing, publish-ready form sections | `products` |
| Product Variants | Catalog | variant CRUD, default variant switch, variant pricing | `product_variants` |
| Product Attributes And Tags | Catalog | attributes key-value editor, tags editor | `product_attributes`, `product_tags` |
| Product Media | Catalog | media gallery manager per product | `media_assets` |
| Advertisements | Catalog | ad slot CRUD by target (product/category/subcategory) | `advertisements` |
| Inventory | Inventory | stock list, variant stock view, reserve/release/manual adjust, low-stock filters | `inventories`, `products`, `product_variants` |
| Carts | Commerce | active carts, abandoned carts, line-item viewer | `carts`, `cart_items`, `customers` |
| Wishlists | Commerce | wishlist viewer by customer, product/variant mapping | `wishlists` |
| Orders | Sales | order list, status updates, line items, totals, customer link | `orders`, `order_items`, `order_addresses` |
| Payments | Sales | payment status tracking, transaction lookup, payment method filters | `payments` |
| Coupons | Sales | coupon CRUD, activation window, usage tracking | `coupons`, `coupon_usages` |
| Delivery | Shipping | courier config, shipment timeline, partner refs, webhook events, API logs | `couriers`, `courier_branches`, `courier_pickup_addresses`, `shipments`, `shipment_trackings`, `pickup_requests`, `delivery_webhook_events`, `delivery_api_logs` |
| Reviews | Support | moderate reviews, publish/unpublish, product/site review split | `reviews` |
| FAQs | Support | FAQ CRUD, product/site FAQ split, active toggle | `faqs` |
| Product Inquiries | Support | inbox, handled/view flags, reply thread | `inquiries`, `replies` |
| Contacts | Support | contact inbox, view/handled state through replies | `contacts`, `replies` |
| Site Inquiries | Support | AI Digital Hair Color form inbox, type filters, admin note, replies | `site_inquiries`, `replies` |
| Blog Posts | Content | blog post CRUD, publish toggle | `blog_posts` |
| SEO Metadata | Content | SEO entry CRUD, entity mapping, slug targeting | `seo_metadata` |
| Newsletter | Marketing | subscribers list, subscribe state, segments | `newsletters` |
| Web Push Subscriptions | Marketing | subscription registry, active/inactive, device/platform view | `web_push_subscriptions` |
| Web Push Notifications | Marketing | compose/send queue list, status timeline, failure diagnostics | `web_push_notifications` |
| Email Campaigns | Marketing | campaign CRUD, recipients, queue status, logs | `email_campaigns`, `email_recipients`, `email_queues`, `email_logs` |
| Activity Logs | Monitoring | user/customer activity timeline and filters | `user_activities`, `user_metadata` |
| Audit Logs | Monitoring | admin change trail by entity and actor | `audit_logs` |

---

## 3) Recommended Navigation Groups

| Group | Pages |
| --- | --- |
| Dashboard | Overview |
| Access Control | Admin Users |
| Customers | Customers |
| Catalog | Categories, Products, Product Variants, Product Attributes And Tags, Product Media, Advertisements |
| Inventory | Inventory |
| Commerce | Carts, Wishlists, Orders, Payments, Coupons |
| Shipping | Delivery |
| Support | Reviews, FAQs, Product Inquiries, Contacts, Site Inquiries |
| Content | Blog Posts, SEO Metadata |
| Marketing | Newsletter, Web Push Subscriptions, Web Push Notifications, Email Campaigns |
| Monitoring | Activity Logs, Audit Logs |

---

## 4) Page-Level Feature Checklist

Use this checklist per module page:

| Feature Type | Required |
| --- | --- |
| List table view | yes |
| Search | yes |
| Filters | yes |
| Sort | yes |
| Pagination | yes |
| Detail drawer/modal | yes |
| Create/edit form | where module is writable |
| Soft-delete visibility | where `is_deleted` exists |
| Bulk actions | optional but recommended |
| Export CSV/XLSX | optional |

---

## 5) Key UI Behavior Rules

| Rule | Description |
| --- | --- |
| Status chips | Use consistent chips for states like `active`, `inactive`, `handled`, `queued`, `sent`, `failed`, `delivered` |
| Timeline views | Use timeline UI for `shipment_trackings`, webhook events, audit logs |
| Identity links | Make customer/user references clickable to their detail drawers |
| Variant-awareness | Always show product + variant context together in cart/order/inventory views |
| Idempotency visibility | Show `idempotency_key` in support and web push records when present |
| Hover image preview | In product card/table preview, show cover image and hover image pair |

---

## 6) Priority For Frontend Build

| Priority | Pages |
| --- | --- |
| P1 (must have) | Overview, Customers, Categories, Products, Product Variants, Inventory, Orders, Delivery, Product Inquiries, Contacts, Site Inquiries |
| P2 | Payments, Coupons, Reviews, FAQs, Newsletter, Web Push modules, Email Campaigns |
| P3 | Blog Posts, SEO Metadata, Activity Logs, Audit Logs, advanced bulk/export tools |

---

## 7) Notes For Frontend Developer

1. Design all pages as data-heavy admin surfaces, not marketing layouts.
2. Most tables use soft delete (`is_deleted`) and timestamps from base columns.
3. Build forms as modular sections so fields can be expanded without redesign.
4. Support responsive behavior, but desktop-first density is preferred.
5. Keep route names stable and module-based, for example:
   - `/dashboard/products`
   - `/dashboard/orders`
   - `/dashboard/delivery/shipments`
   - `/dashboard/support/site-inquiries`

