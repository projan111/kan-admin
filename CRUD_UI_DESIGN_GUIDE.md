# CRUD UI Design Guide

## Overview
This guide documents the modern, improved UI design system for all CRUD (Create, Read, Update, Delete) operations in the dashboard.

## Design Principles

### 1. **Zinc & Slate Color System**
- **Zinc** for structural elements (backgrounds, borders, buttons)
- **Slate** for text and content
- Follows the color mapping in `COLOR_SCHEME.md`

### 2. **Modern Form Layout**
- Clean, spacious design with proper visual hierarchy
- Gradient header section with stats cards
- Sectioned form content with clear labels
- Sticky action buttons at the bottom

### 3. **Consistent Components**
All CRUD pages use these shared components from `src/shared/components/forms/ModernFormLayout.tsx`:

#### `ModernFormLayout`
Main wrapper for Create/Edit pages with:
- Title, subtitle, and eyebrow text
- Back button navigation
- Optional stats cards in header
- Gradient header background

#### `FormSection`
Groups related form fields with:
- Section title and description
- White background with border
- Proper spacing between fields

#### `FormField`
Individual field wrapper with:
- Label with optional required indicator
- Error and hint message support
- Consistent styling

#### `FormActions`
Action buttons section with:
- Submit and Cancel buttons
- Loading states
- Icons support
- Proper spacing and alignment

## Implementation Pattern

### Create Page Structure
```tsx
import {
  ModernFormLayout,
  FormSection,
  FormField,
  FormActions,
} from "@/shared/components/forms/ModernFormLayout";
import { Plus, Loader2 } from "lucide-react";

export const EntityCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const create = useCreateEntity();
  
  return (
    <ModernFormLayout
      title="Create Entity"
      subtitle="Add a new entity with complete details."
      eyebrow="Entity Management"
      onBack={() => navigate("/dashboard/entities")}
      stats={[
        { label: "Status", value: "Draft" },
        { label: "Type", value: "New Entity" },
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection
          title="Basic Information"
          description="Core entity details"
        >
          {/* Form fields here */}
        </FormSection>

        <FormSection
          title="Additional Details"
          description="Optional information"
        >
          {/* More form fields */}
        </FormSection>

        <FormActions
          submitLabel="Create Entity"
          submitIcon={isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={16} />}
          isSubmitting={isSubmitting}
          onCancel={() => navigate("/dashboard/entities")}
        />
      </form>
    </ModernFormLayout>
  );
};
```

### Edit Page Structure
```tsx
export const EntityEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const get = useEntityGet(id);
  const update = useUpdateEntity();
  
  if (get.isLoading) return <div className="p-6 text-center text-slate-600">Loading...</div>;
  if (get.isError) return <div className="p-6 text-center text-red-600">Failed to load</div>;
  
  return (
    <ModernFormLayout
      title="Edit Entity"
      subtitle="Update entity information and details."
      eyebrow="Entity Management"
      onBack={() => navigate("/dashboard/entities")}
      stats={[
        { label: "Status", value: "Active" },
        { label: "Last Updated", value: "Today" },
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Same structure as Create page */}
        
        <FormActions
          submitLabel="Update Entity"
          submitIcon={isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={16} />}
          isSubmitting={isSubmitting}
          onCancel={() => navigate("/dashboard/entities")}
        />
      </form>
    </ModernFormLayout>
  );
};
```

## Color Classes Reference

### Backgrounds
- `bg-zinc-50` - Light background, hover states
- `bg-zinc-100` - Icon containers
- `bg-zinc-900` - Primary buttons, dark backgrounds
- `bg-white` - Card backgrounds, form sections

### Borders
- `border-zinc-100` - Subtle dividers
- `border-zinc-200` - Card borders, main dividers
- `border-zinc-300` - Input borders

### Text
- `text-zinc-900` - Primary headings, important text
- `text-slate-600` - Body text, descriptions
- `text-slate-500` - Secondary text, labels
- `text-slate-400` - Tertiary text, icons

### Interactive States
- `hover:bg-zinc-50` - Hover background
- `hover:bg-zinc-800` - Button hover (dark)
- `hover:text-zinc-600` - Hover text
- `focus:border-zinc-400` - Input focus

## Typography Scale

### Headings
- Page Title: `text-3xl font-semibold tracking-tight text-zinc-900`
- Section Title: `text-lg font-semibold text-zinc-900`
- Eyebrow: `text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500`

### Body Text
- Description: `text-sm leading-relaxed text-slate-600`
- Label: `text-sm font-medium text-zinc-900`
- Hint: `text-xs text-slate-500`
- Error: `text-xs text-red-600`

## Spacing System
- Form sections: `space-y-6` (24px)
- Form fields: `space-y-4` (16px)
- Field internal: `space-y-2` (8px)
- Button groups: `gap-3` (12px)

## Updated Pages

### ✅ Completed
1. **Brand** - `BrandCreatePage.tsx`, `BrandEditPage.tsx`
   - Modern form layout with zinc/slate colors
   - Image color palette extraction
   - Stats cards in header

### 🔄 To Update
2. **Company** - `CompanyCreatePage.tsx`, `CompanyEditPage.tsx`
3. **Team** - `TeamCreatePage.tsx`, `TeamEditPage.tsx`
4. **CSR** - `CsrCreatePage.tsx`, `CsrEditPage.tsx`
5. **Newsroom** - `NewsroomCreatePage.tsx`, `NewsroomEditPage.tsx`
6. **Users** - `UsersCreatePage.tsx`, `UsersEditPage.tsx`
7. **Contact** - `ContactCreatePage.tsx`

## Benefits

### User Experience
- ✅ Clear visual hierarchy
- ✅ Consistent design across all CRUD operations
- ✅ Better readability with zinc/slate colors
- ✅ Contextual information in header stats
- ✅ Clear section organization

### Developer Experience
- ✅ Reusable components
- ✅ Consistent patterns
- ✅ Easy to maintain
- ✅ Type-safe props
- ✅ Accessible by default

## Next Steps

1. Apply `ModernFormLayout` to remaining CRUD pages
2. Ensure all pages use zinc/slate color system
3. Add proper loading and error states
4. Test form validation and submission
5. Verify responsive design on mobile devices

## Notes

- All inline styles have been replaced with Tailwind classes
- Forms use proper semantic HTML
- Loading states are handled consistently
- Error messages are user-friendly
- Back navigation is always available
