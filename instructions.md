# Ecommerce Dashboard Template

## Purpose
Frontend ecommerce admin template for fast module development and backend integration.

## Run
```bash
pnpm install
pnpm dev
```

## Validate
```bash
pnpm lint
pnpm build
```

## Current Auth State
- Demo mode enabled.
- Login works locally without backend auth.
- Guards are bypassed for development.

Production: restore real auth and permission checks before release.

## Important Files
- `src/app/config/ecommerceModules.ts` (module/nav source of truth)
- `src/app/router/AppRouter.tsx` (routes)
- `src/shared/components/dashboard/Sidebar.tsx` (sidebar)
- `src/pages/dashboard/overview/DashboardOverviewPage.tsx` (overview)
- `src/shared/api/api.ts` (api client)
- `src/index.css` (theme tokens)

## Add a New Module
1. Add module entry in `src/app/config/ecommerceModules.ts`.
2. Add `types/api/hooks` in `src/features/<module>/`.
3. Add pages in `src/pages/dashboard/<module>/`.
4. Register routes in `src/app/router/AppRouter.tsx`.
5. Run `pnpm lint && pnpm build`.

## Implemented Modules
- Users
- Customers
- Team
- Brand
- Company
- CSR
- Newsroom
- FAQ

Other ecommerce routes currently use placeholder pages.
