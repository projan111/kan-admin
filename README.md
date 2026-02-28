# Ecommerce Dashboard Template

Premium ecommerce admin dashboard template built with React + TypeScript + Vite, designed for fast backend integration and scalable module development.

## Features

- Ecommerce-first enterprise module architecture
- Premium dashboard UI (responsive layout, grouped sidebar, analytics overview)
- Modular route + page structure for rapid feature expansion
- Reusable CRUD patterns with typed APIs/hooks
- TanStack Query-ready data flow
- Demo auth mode for frontend-first development

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Zod
- Axios
- Lucide Icons

## Quick Start

```bash
pnpm install
pnpm dev
Scripts
bash

pnpm dev
pnpm lint
pnpm build
Current Auth Mode
This template currently runs in demo auth mode:

Login works locally (no backend login required)
Guards are bypassed during development
Before production, re-enable:

backend sign-in flow
role/permission guard enforcement
Project Structure
text

src/
  app/
    config/
      ecommerceModules.ts
    guards/
    layouts/
    providers/
    router/
  features/
    <module>/
      <module>.types.ts
      <module>.api.ts
      <module>.hooks.ts
  pages/
    auth/
    dashboard/
  shared/
    api/
    auth/
    components/
    hooks/
    utils/
Core Files
src/app/config/ecommerceModules.ts → module + sidebar source of truth
src/app/router/AppRouter.tsx → route definitions
src/shared/components/dashboard/Sidebar.tsx → grouped enterprise nav
src/pages/dashboard/overview/DashboardOverviewPage.tsx → overview screen
src/shared/api/api.ts → API client layer
src/index.css → theme tokens and global styling
Module Coverage
Implemented
Users
Customers
Team
Brand
Company
CSR
Newsroom
FAQ
Scaffolded (Placeholder Routes Ready)
Products
Orders
Inventory
Payments
Reports
Tax
Discounts
Campaigns
Loyalty
Reviews
Shipping
Returns
Content/CMS
AI Insights
Multi-Vendor
Multi-Store
Subscriptions
Bundles
Apps
Settings
Notifications
Logs
Adding a New Module
Add module metadata in src/app/config/ecommerceModules.ts
Create types/api/hooks in src/features/<module>/
Add pages in src/pages/dashboard/<module>/
Register routes in src/app/router/AppRouter.tsx
Run pnpm lint && pnpm build
Quality Check
bash

pnpm lint
pnpm build
Notes
Use instructions.md for concise developer onboarding within this repo.
Keep UI consistency by reusing shared dashboard/table/form primitives.
