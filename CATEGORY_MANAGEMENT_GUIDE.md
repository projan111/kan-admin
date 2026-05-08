# Category Management System

## Overview
Complete category and subcategory management system with modern UI design using zinc/slate colors.

## Features

### ✅ Category Management
- **List View** - Display all categories with stats, search, and pagination
- **Create Category** - Add new main categories with full details
- **Edit Category** - Update category information and manage subcategories
- **Delete Category** - Remove categories (with confirmation)

### ✅ Subcategory Management
- **Create Subcategory** - Add subcategories under a parent category
- **Edit Subcategory** - Update subcategory information
- **List Subcategories** - View all subcategories within a category
- **Delete Subcategory** - Remove subcategories

## File Structure

```
src/pages/dashboard/categories/
├── CategoriesPage.tsx          # Main list view
├── CategoryCreatePage.tsx      # Create new category
├── CategoryEditPage.tsx        # Edit category + manage subcategories
├── SubcategoryCreatePage.tsx   # Create new subcategory
├── SubcategoryEditPage.tsx     # Edit subcategory
└── index.ts                    # Exports
```

## Routes

```tsx
/dashboard/categories                                    # List all categories
/dashboard/categories/create                             # Create category
/dashboard/categories/:id                                # Edit category
/dashboard/categories/:id/subcategories/create           # Create subcategory
/dashboard/categories/:id/subcategories/:subcategoryId   # Edit subcategory
```

## Category Data Model

```typescript
type Category = {
  id: string;
  name: string;                    // Display name
  slug: string;                    // URL-friendly identifier
  description: string;             // Category description
  metaTitle: string;               // SEO title
  metaDescription: string;         // SEO description
  status: "Active" | "Inactive";   // Visibility status
  sortOrder: number;               // Display order
  icon: string;                    // Lucide icon name
  coverImage: string;              // Banner image URL
  subcategories: Subcategory[];    // Child subcategories
  products: number;                // Product count
  createdAt: string;               // Creation date
};
```

## Subcategory Data Model

```typescript
type Subcategory = {
  id: string;
  name: string;                    // Display name
  slug: string;                    // URL-friendly identifier
  description: string;             // Subcategory description
  status: "Active" | "Inactive";   // Visibility status
  sortOrder: number;               // Display order
  icon: string;                    // Lucide icon name
  categoryId: string;              // Parent category ID
  products: number;                // Product count
};
```

## UI Components

### Categories List Page
- **Stats Cards**: Total Categories, Active, Subcategories, Total Products
- **Search Bar**: Filter categories by name, slug, description
- **Action Button**: "+ New Category"
- **Table Columns**:
  - Checkbox (bulk selection)
  - # (row number)
  - Category (with icon)
  - Slug
  - Description
  - Subcategories count
  - Products count
  - Status badge
  - Created date
  - Actions (Edit, Delete)

### Category Create/Edit Page
- **Header Section**: Title, subtitle, back button, stats cards
- **Basic Information Section**:
  - Category Name (required)
  - Slug (auto-generated, editable)
  - Description
  - Status (Active/Inactive)
  - Sort Order
- **Subcategories Section** (Edit only):
  - List of subcategories
  - Add Subcategory button
  - Edit/Delete actions per subcategory
- **SEO Settings Section**:
  - Meta Title
  - Meta Description
- **Media Section**:
  - Icon Name (Lucide icon)
  - Cover Image URL
  - Image preview
- **Preview Card**: Live preview of category appearance
- **Action Buttons**: Save/Cancel

### Subcategory Create/Edit Page
- **Header Section**: Shows parent category context
- **Basic Information Section**:
  - Subcategory Name (required)
  - Slug (auto-generated, editable)
  - Description
  - Status (Active/Inactive)
  - Sort Order
- **Display Settings Section**:
  - Icon Name (Lucide icon)
- **Preview Card**: Shows hierarchy (Category → Subcategory)
- **Action Buttons**: Save/Cancel

## Color System

### Zinc Colors (Structure)
- `bg-zinc-50` - Light backgrounds
- `bg-zinc-900` - Primary buttons
- `border-zinc-200` - Card borders
- `border-zinc-300` - Input borders
- `text-zinc-900` - Headings

### Slate Colors (Content)
- `text-slate-500` - Labels, secondary text
- `text-slate-600` - Body text, descriptions
- `text-slate-400` - Icons, tertiary text

### Status Colors
- **Active**: `bg-emerald-50 text-emerald-700`
- **Inactive**: `bg-red-50 text-red-700`

## Features

### Auto-Slug Generation
- Automatically generates URL-friendly slugs from category/subcategory names
- Converts to lowercase
- Replaces spaces and special characters with hyphens
- Can be manually edited

### Hierarchy Display
- Categories contain subcategories
- Breadcrumb navigation shows hierarchy
- Parent category context in subcategory pages

### Validation
- Required fields: Name, Slug
- Slug format validation
- Duplicate slug prevention (to be implemented)

### SEO Optimization
- Meta title and description fields
- Character count hints
- URL-friendly slugs

### Visual Feedback
- Loading states during submission
- Success/error messages
- Preview cards showing live changes
- Hover states on interactive elements

## Usage Examples

### Creating a Category
1. Navigate to `/dashboard/categories`
2. Click "+ New Category"
3. Fill in:
   - Name: "Skincare"
   - Description: "Face and body care products"
   - Status: Active
   - Meta Title: "Premium Skincare Products | KAN"
4. Click "Create Category"

### Adding a Subcategory
1. Navigate to category edit page
2. Click "+ Add Subcategory" in Subcategories section
3. Fill in:
   - Name: "Moisturizers"
   - Description: "Hydrating creams and lotions"
   - Status: Active
4. Click "Create Subcategory"

### Editing a Category
1. Click Edit icon on category row
2. Update fields as needed
3. Manage subcategories in the Subcategories section
4. Click "Update Category"

## Integration Points

### Product Assignment
- Products can be assigned to categories and subcategories
- Category/subcategory selection in product forms
- Product count displayed in category list

### Navigation
- Categories used in main site navigation
- Subcategories in dropdown menus
- Breadcrumb navigation on product pages

### Filtering
- Filter products by category
- Filter products by subcategory
- Multi-level filtering support

## Future Enhancements

### Planned Features
- [ ] Drag-and-drop reordering
- [ ] Bulk actions (activate, deactivate, delete)
- [ ] Category images upload (not just URLs)
- [ ] Category attributes/filters
- [ ] Multi-level subcategories (sub-subcategories)
- [ ] Category templates
- [ ] Import/Export categories
- [ ] Category analytics (views, conversions)

### API Integration
- Connect to backend API endpoints
- Real-time data updates
- Optimistic UI updates
- Error handling and retry logic

## Best Practices

### Naming Conventions
- Use clear, descriptive category names
- Keep slugs short and memorable
- Use consistent naming patterns

### Organization
- Limit subcategories to 5-10 per category
- Use logical groupings
- Consider user navigation patterns

### SEO
- Write unique meta titles and descriptions
- Include relevant keywords
- Keep meta descriptions under 160 characters

### Performance
- Lazy load subcategories
- Paginate large category lists
- Cache category data
- Optimize images

## Notes

- All pages use the modern `ModernFormLayout` component
- Consistent zinc/slate color system throughout
- Responsive design for mobile devices
- Accessible form controls and navigation
- Loading states for better UX
- Preview cards for visual feedback
