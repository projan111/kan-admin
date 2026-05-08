# Dashboard Design System

This document describes the unified design system for all dashboard pages.

## Theme Overview

### Color Palette
- **Blue Theme Variations**: Light to dark blue shades (blue, sky, indigo, purple, violet, cyan)
- **Accent Colors**: Emerald (success), Amber (warning), Rose (danger)
- **Neutral**: Zinc and Slate for text and borders (zinc for backgrounds/borders, slate for text)

### Components

## 1. StatCardV2
Colorful stat cards with icons.

```tsx
import { StatCardV2 } from "@/shared/components/dashboard/StatCardV2";
import { Users } from "lucide-react";

<StatCardV2
  label="TOTAL CLIENTS"
  value="6"
  subtitle="+2 this month"
  icon={Users}
  colorVariant="blue" // blue, sky, indigo, purple, violet, cyan, emerald, teal, rose, amber
/>
```

## 2. PageLayout
Consistent page wrapper with header and actions.

```tsx
import { PageLayout } from "@/shared/components/dashboard/PageLayout";

<PageLayout
  title="Customers"
  showDateFilter
  showExport
  onNew={() => navigate('/create')}
  newButtonLabel="New Customer"
>
  {/* Your page content */}
</PageLayout>
```

## 3. DataTableV2
Modern table with tabs, search, and pagination.

```tsx
import { DataTableV2 } from "@/shared/components/dashboard/DataTableV2";

<DataTableV2
  title="Services Requiring Attention"
  subtitle="5 items"
  icon={<AlertTriangle className="text-yellow-600" />}
  tabs={[
    { key: "all", label: "All", count: 10 },
    { key: "active", label: "Active", count: 5 },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  columns={[
    { key: "id", label: "#", width: "60px" },
    { key: "name", label: "Name" },
    { 
      key: "status", 
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />
    },
  ]}
  data={data}
  searchPlaceholder="Search deals..."
  searchValue={search}
  onSearchChange={setSearch}
  onEdit={(row) => console.log('Edit', row)}
  onDelete={(row) => console.log('Delete', row)}
  currentPage={1}
  totalPages={5}
  onPageChange={setPage}
/>
```

## 4. StatusBadge
Colored status badges.

```tsx
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

<StatusBadge status="Proposal" variant="proposal" />
<StatusBadge status="Closed Won" variant="closedWon" />
<StatusBadge status="Expired" variant="expired" />
```

Available variants:
- `proposal` - Purple
- `qualified` - Blue
- `negotiation` - Amber
- `closedWon` - Emerald
- `closedLost` - Red
- `active` - Emerald
- `pending` - Amber
- `expired` - Red
- `expiring` - Amber

## Example Page Structure

```tsx
import { PageLayout } from "@/shared/components/dashboard/PageLayout";
import { StatCardV2 } from "@/shared/components/dashboard/StatCardV2";
import { DataTableV2 } from "@/shared/components/dashboard/DataTableV2";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";
import { Users, Briefcase, DollarSign } from "lucide-react";

export const MyPage = () => {
  return (
    <PageLayout
      title="My Page"
      showDateFilter
      showExport
      onNew={() => {}}
      newButtonLabel="New Item"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCardV2
          label="TOTAL PIPELINE"
          value="$77,400"
          icon={DollarSign}
          colorVariant="emerald"
        />
        <StatCardV2
          label="OPEN DEALS"
          value="6"
          icon={Briefcase}
          colorVariant="sky"
        />
        <StatCardV2
          label="CLOSED WON"
          value="1"
          icon={Users}
          colorVariant="purple"
        />
      </div>

      {/* Data Table */}
      <DataTableV2
        title="Deals"
        tabs={[
          { key: "all", label: "All" },
          { key: "qualified", label: "Qualified" },
          { key: "proposal", label: "Proposal" },
        ]}
        activeTab="all"
        columns={[
          { key: "id", label: "#" },
          { key: "deal", label: "Deal" },
          { 
            key: "status", 
            label: "Status",
            render: (row) => <StatusBadge status={row.status} />
          },
        ]}
        data={deals}
        onEdit={(row) => {}}
        onDelete={(row) => {}}
      />
    </PageLayout>
  );
};
```

## Design Principles

1. **Consistent Spacing**: Use `p-6` for page padding, `gap-4` or `gap-6` for grids
2. **Rounded Corners**: `rounded-xl` for cards and containers, `rounded-lg` for buttons
3. **Shadows**: `shadow-sm` for subtle elevation
4. **Borders**: `border-zinc-200` for light borders, `border-zinc-100` for subtle dividers
5. **Typography**: 
   - Page titles: `text-2xl font-bold text-zinc-900`
   - Card labels: `text-[10px] font-semibold uppercase tracking-wider text-slate-600`
   - Card values: `text-3xl font-bold text-zinc-900`
   - Table headers: `text-xs font-semibold uppercase tracking-wider text-slate-500`
   - Body text: `text-slate-600`
   - Secondary text: `text-slate-500`
   - Tertiary text: `text-slate-400`
6. **Hover States**: Always include `hover:` states for interactive elements
7. **Transitions**: Use `transition-colors` or `transition-all` for smooth interactions

## Color Usage Guidelines

### Stat Cards
- Use different color variants for each metric to create visual distinction
- Rotate through: blue → sky → indigo → purple → violet → cyan
- Use emerald for positive metrics (revenue, growth)
- Use amber for warnings
- Use rose for critical items

### Status Badges
- Green (emerald): Success, completed, active, won
- Blue: In progress, qualified
- Purple: Proposal, draft
- Amber: Pending, warning, expiring
- Red: Error, cancelled, expired, lost

### Buttons
- Primary actions: Black (`bg-zinc-900 hover:bg-zinc-800`)
- Secondary actions: White with border (`bg-white border-zinc-200 hover:bg-zinc-50`)
- Destructive: Red (`bg-red-600 hover:bg-red-700`)

## Accessibility
- All interactive elements have hover states
- Proper color contrast ratios
- Semantic HTML structure
- ARIA labels where needed
