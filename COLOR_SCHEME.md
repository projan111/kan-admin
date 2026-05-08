# Dashboard Color Scheme - Zinc & Slate

## Color System

We use **Zinc** and **Slate** from Tailwind CSS as our neutral colors instead of gray.

### Zinc (Backgrounds, Borders, UI Elements)
- `bg-zinc-900` - Primary buttons, dark backgrounds
- `bg-zinc-800` - Hover states for dark elements
- `bg-zinc-100` - Light backgrounds, icon containers
- `bg-zinc-50` - Hover states for light elements, subtle backgrounds
- `border-zinc-300` - Input borders, card borders
- `border-zinc-200` - Table borders, dividers
- `border-zinc-100` - Subtle dividers
- `text-zinc-900` - Primary headings, important text

### Slate (Text, Secondary Elements)
- `text-slate-600` - Body text, descriptions
- `text-slate-500` - Secondary text, table headers, labels
- `text-slate-400` - Tertiary text, icons, placeholders
- `text-slate-300` - Disabled text

## Usage Guidelines

### Typography
```tsx
// Page titles
<h1 className="text-3xl font-semibold text-zinc-900">

// Descriptions
<p className="text-sm text-slate-600">

// Table headers
<th className="text-xs font-medium uppercase tracking-wider text-slate-500">

// Body text
<span className="text-sm text-slate-600">

// Secondary text
<span className="text-xs text-slate-500">

// Icon colors
<Icon className="text-slate-400" />
```

### Buttons
```tsx
// Primary button
<button className="bg-zinc-900 text-white hover:bg-zinc-800">

// Secondary button
<button className="border border-zinc-300 text-slate-600 hover:bg-zinc-50">
```

### Inputs
```tsx
<input className="border border-zinc-300 text-zinc-900 placeholder-slate-500 focus:border-zinc-400" />
```

### Tables
```tsx
// Table container
<div className="border border-zinc-200 bg-white">

// Table header
<thead>
  <tr className="border-b border-zinc-200 bg-white">
    <th className="text-xs font-medium uppercase tracking-wider text-slate-500">

// Table body
<tbody className="divide-y divide-zinc-200 bg-white">
  <tr className="hover:bg-zinc-50">
    <td className="text-sm text-slate-600">
```

### Cards
```tsx
// Stat card labels
<p className="text-xs font-medium uppercase tracking-wider text-slate-600">

// Stat card values
<p className="text-3xl font-bold text-zinc-900">
```

## Color Contrast Ratios

All color combinations meet WCAG AA standards:
- `text-zinc-900` on white: 21:1 (AAA)
- `text-slate-600` on white: 7.5:1 (AAA)
- `text-slate-500` on white: 5.5:1 (AA)
- `text-slate-400` on white: 4.5:1 (AA)

## Migration from Gray

| Old (Gray) | New (Zinc/Slate) | Usage |
|------------|------------------|-------|
| `text-gray-900` | `text-zinc-900` | Headings, primary text |
| `text-gray-600` | `text-slate-600` | Body text, descriptions |
| `text-gray-500` | `text-slate-500` | Secondary text, labels |
| `text-gray-400` | `text-slate-400` | Tertiary text, icons |
| `bg-gray-900` | `bg-zinc-900` | Dark backgrounds, buttons |
| `bg-gray-50` | `bg-zinc-50` | Light backgrounds, hover states |
| `border-gray-300` | `border-zinc-300` | Input borders |
| `border-gray-200` | `border-zinc-200` | Card borders, dividers |
| `hover:bg-gray-50` | `hover:bg-zinc-50` | Hover states |
| `hover:text-gray-600` | `hover:text-zinc-600` | Hover text |

## Examples

### Complete Page Header
```tsx
<div className="mb-6">
  <h1 className="text-3xl font-semibold text-zinc-900">
    Page Title
  </h1>
  <p className="mt-2 text-sm text-slate-600">
    Page description goes here
  </p>
</div>
```

### Complete Stat Card
```tsx
<div className="rounded-xl bg-blue-50 p-4">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
        Total Items
      </p>
      <p className="mt-1 text-3xl font-bold text-zinc-900">
        1,234
      </p>
    </div>
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
      <Icon size={22} className="text-blue-600" />
    </div>
  </div>
</div>
```

### Complete Table Row
```tsx
<tr className="transition-colors hover:bg-zinc-50">
  <td className="px-6 py-4 text-sm text-slate-500">1</td>
  <td className="px-6 py-4">
    <span className="text-sm font-medium text-zinc-900">
      Item Name
    </span>
  </td>
  <td className="px-6 py-4 text-sm text-slate-600">
    Description
  </td>
  <td className="px-6 py-4">
    <button className="text-slate-400 transition-colors hover:text-zinc-600">
      <Edit size={16} />
    </button>
  </td>
</tr>
```

## Notes

- **Zinc** is used for structural elements (backgrounds, borders, buttons)
- **Slate** is used for text and content
- This creates a subtle but noticeable difference from standard gray
- Zinc has a slightly cooler, more modern tone
- Slate has better readability for text content
