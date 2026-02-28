# Ecommerce Dashboard Template - Complete Developer Setup Guide

This guide takes a new developer from first clone to full feature development workflow.

## 1) Prerequisites

Install these first:
- Node.js `>= 20`
- `pnpm` (recommended package manager)
- Git

Check versions:
```bash
node -v
pnpm -v
git --version
```

## 2) Clone and Install

```bash
git clone <your-repo-url>
cd ecommerce-dashboard
pnpm install
```

## 3) Environment Setup (`.env`)

Create `.env` in project root.

Minimal example:
```env
VITE_BACKEND_URL=http://localhost:5558
VITE_SOCKET_NAMESPACE=/api/v1/ecommerce
VITE_SOCKET_TRANSPORTS=polling
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

Notes:
- In current demo-auth mode, recaptcha/auth backend is not required for login.
- Keep variables present for later production auth re-enable.

## 4) Dev Proxy Setup (Vite)

Proxy config lives in `vite.config.ts`.

Expected behavior:
- Frontend calls `/api/...`
- Vite proxy forwards to backend server (ex: `http://localhost:5558`)

If backend URL/port changes, update proxy target in `vite.config.ts`.

## 5) Run the App

```bash
pnpm dev
```

Default Vite URL is usually:
- `http://localhost:5173`

## 6) Current Auth Behavior (Important)

Project currently runs in **demo mode** for rapid frontend development.

What this means:
- Login page works locally without real backend auth.
- Route guards are bypassed.
- You can access dashboard modules without real permission checks.

Files involved:
- `src/pages/LoginPage.tsx`
- `src/app/guards/ProtectedRoute.tsx`
- `src/app/guards/PermissionGuard.tsx`
- `src/app/guards/RoleGuard.tsx`

### Re-enable real auth later
When moving to production-ready behavior:
1. Restore backend login mutation flow in `LoginPage.tsx`
2. Restore real checks in all 3 guard files
3. Verify 401 handling in `src/shared/api/api.ts`
4. Verify role/permission gating across routes and sidebar

## 7) Dashboard Architecture

### Source of truth for modules
- `src/app/config/ecommerceModules.ts`

This file controls:
- module label
- route path
- sidebar section grouping
- icon
- module description

### Router
- `src/app/router/AppRouter.tsx`

Defines:
- auth routes
- dashboard routes
- CRUD routes
- placeholder module routes

### Layout shell
- `src/app/layouts/DashboardLayout.tsx`
- `src/shared/components/dashboard/Sidebar.tsx`
- `src/shared/components/dashboard/TopNav.tsx`
- `src/pages/dashboard/overview/DashboardOverviewPage.tsx`

## 8) Existing Module Status

### Implemented modules (working pages)
- Users
- Customers
- Team
- Brand
- Company
- CSR
- Newsroom
- FAQ

### Scaffolded modules (placeholder pages ready)
- Products
- Orders
- Inventory
- Payments
- Reports
- Tax
- Discounts
- Campaigns
- Loyalty
- Reviews
- Shipping
- Returns
- Content/CMS
- AI Insights
- Multi-Vendor
- Multi-Store
- Subscriptions
- Bundles
- Apps
- Settings
- Notifications
- Logs

## 9) API Layer Conventions

API utilities:
- `src/shared/api/api.ts`
- `src/shared/api/crudFactory.ts`

Module API pattern:
- `src/features/<module>/<module>.types.ts` -> entities + DTOs
- `src/features/<module>/<module>.api.ts` -> endpoint mapping
- `src/features/<module>/<module>.hooks.ts` -> TanStack Query hooks

Guidelines:
- Keep DTOs strict and backend-aligned
- Centralize endpoint strings in module API file
- Keep queries/mutations in hooks file

## 10) How to Build a New Module (Start to Finish)

1. Add module in `src/app/config/ecommerceModules.ts`
2. Create feature files:
   - `src/features/<module>/<module>.types.ts`
   - `src/features/<module>/<module>.api.ts`
   - `src/features/<module>/<module>.hooks.ts`
3. Create pages:
   - list page
   - create page
   - edit page
   - view page
4. Register routes in `src/app/router/AppRouter.tsx`
5. Add nav visibility/rules if needed
6. Connect API and test CRUD flows
7. Validate with lint/build

## 11) UI and Styling Rules

Global theming:
- `src/index.css`

Use shared primitives where possible:
- dashboard components under `src/shared/components/dashboard/`
- UI controls under `src/shared/components/ui/`

Keep consistent:
- spacing
- card/table patterns
- button/input behavior
- responsive behavior for mobile + desktop

## 12) Local Validation and Build

Run before commit:
```bash
pnpm lint
pnpm build
```

If build warns about large chunks:
- consider route-level code splitting
- consider `manualChunks` in Vite Rollup config

## 13) Common Troubleshooting

### App doesn’t load API data
- Check `.env` values
- Check proxy target in `vite.config.ts`
- Check backend is running

### Routes working but no data
- Confirm module hooks call correct endpoint paths
- Confirm response envelope shape matches parser assumptions

### Login still hitting backend
- Verify `LoginPage.tsx` is in demo auth flow
- Verify guard files are pass-through

### Styling looks broken
- Ensure `src/index.css` is loaded from `src/main.tsx`
- Check Tailwind build is running (`pnpm dev`/`pnpm build`)

## 14) Production Readiness Checklist

Before production deployment:
- Re-enable real auth flow
- Re-enable permission/role guards
- Verify all secure routes are protected
- Confirm backend URL/env strategy
- Audit module permissions in sidebar + routes
- Run lint/build and full QA

## 15) Key File Map

- `src/main.tsx` - app bootstrap/providers
- `src/App.tsx` - top-level app shell
- `src/app/router/AppRouter.tsx` - all routes
- `src/app/config/ecommerceModules.ts` - module registry
- `src/shared/api/api.ts` - axios instance + response handling
- `src/pages/LoginPage.tsx` - demo login flow
- `src/index.css` - theme and global styles

---

If you are a new developer on this codebase, follow sections **1 -> 6** first, then use **10** for module development workflow.
