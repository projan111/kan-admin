import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Loader2, FolderTree, Plus } from "lucide-react";
import {
  ModernFormLayout,
  FormSection,
  FormField,
  FormActions,
} from "@/shared/components/forms/ModernFormLayout";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

type FormData = {
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  status: "Active" | "Inactive";
  sortOrder: string;
  icon: string;
  coverImage: string;
};

type Subcategory = {
  id: string;
  name: string;
  slug: string;
  products: number;
  status: "Active" | "Inactive";
};

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Sample subcategories data
const sampleSubcategories: Subcategory[] = [
  {
    id: "1",
    name: "Moisturizers",
    slug: "moisturizers",
    products: 12,
    status: "Active",
  },
  {
    id: "2",
    name: "Cleansers",
    slug: "cleansers",
    products: 8,
    status: "Active",
  },
  { id: "3", name: "Serums", slug: "serums", products: 15, status: "Active" },
  { id: "4", name: "Masks", slug: "masks", products: 7, status: "Inactive" },
];

export const CategoryEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);
  const [subcategories] = React.useState<Subcategory[]>(sampleSubcategories);
  const [formData, setFormData] = React.useState<FormData>({
    name: "Skincare",
    slug: "skincare",
    description: "Face and body care products for all skin types",
    metaTitle: "Premium Skincare Products | KAN Cosmetics",
    metaDescription:
      "Discover our range of premium skincare products including moisturizers, cleansers, serums, and masks for all skin types.",
    status: "Active",
    sortOrder: "1",
    icon: "FolderTree",
    coverImage: "/images/categories/skincare.jpg",
  });

  const updateField = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "name" && !slugManuallyEdited) {
        next.slug = slugify(String(value));
      }

      return next;
    });
  };

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    updateField("slug", slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.slug.trim()) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updating category:", formData);
    setIsSubmitting(false);
    navigate("/dashboard/categories");
  };

  const isValid = formData.name.trim() && formData.slug.trim();

  return (
    <ModernFormLayout
      title="Edit Category"
      subtitle="Update category information, manage subcategories, and organize your product catalog."
      eyebrow="Category Management"
      onBack={() => navigate("/dashboard/categories")}
      stats={[
        { label: "Subcategories", value: subcategories.length.toString() },
        {
          label: "Total Products",
          value: subcategories
            .reduce((sum, s) => sum + s.products, 0)
            .toString(),
        },
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <FormSection
          title="Basic Information"
          description="Core category details and identification"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Category Name"
              required
              hint="Display name for the category"
            >
              <Input
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g., Skincare, Makeup, Hair Care"
                className="border-zinc-300 focus:border-zinc-400"
              />
            </FormField>

            <FormField label="Slug" required hint="URL-friendly identifier">
              <Input
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="e.g., skincare, makeup, hair-care"
                className="border-zinc-300 focus:border-zinc-400"
              />
            </FormField>
          </div>

          <FormField
            label="Description"
            hint="Brief description of what products belong in this category"
          >
            <textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the category and what products it contains..."
              rows={3}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-slate-500 outline-none transition-colors focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/15"
            />
          </FormField>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Status" required>
              <select
                value={formData.status}
                onChange={(e) =>
                  updateField("status", e.target.value as "Active" | "Inactive")
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/15"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </FormField>

            <FormField label="Sort Order" hint="Lower numbers appear first">
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => updateField("sortOrder", e.target.value)}
                placeholder="0"
                className="border-zinc-300 focus:border-zinc-400"
              />
            </FormField>
          </div>
        </FormSection>

        {/* Subcategories Management */}
        <FormSection
          title="Subcategories"
          description="Manage subcategories within this category"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              {subcategories.length} subcategories
            </p>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                navigate(`/dashboard/categories/${id}/subcategories/create`)
              }
              className="bg-zinc-900 text-white hover:bg-zinc-800"
            >
              <Plus size={14} />
              Add Subcategory
            </Button>
          </div>

          <div className="space-y-2">
            {subcategories.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                    <FolderTree size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {sub.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {sub.products} products • {sub.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      sub.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {sub.status}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/dashboard/categories/${id}/subcategories/${sub.id}`,
                      )
                    }
                    className="text-slate-400 hover:text-zinc-600"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        {/* SEO Settings */}
        <FormSection
          title="SEO Settings"
          description="Search engine optimization metadata"
        >
          <FormField
            label="Meta Title"
            hint="Title for search engines (recommended: 50-60 characters)"
          >
            <Input
              value={formData.metaTitle}
              onChange={(e) => updateField("metaTitle", e.target.value)}
              placeholder="e.g., Premium Skincare Products | KAN Cosmetics"
              className="border-zinc-300 focus:border-zinc-400"
            />
          </FormField>

          <FormField
            label="Meta Description"
            hint="Description for search engines (recommended: 150-160 characters)"
          >
            <textarea
              value={formData.metaDescription}
              onChange={(e) => updateField("metaDescription", e.target.value)}
              placeholder="Describe the category for search engines..."
              rows={3}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-slate-500 outline-none transition-colors focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/15"
            />
          </FormField>
        </FormSection>

        {/* Media */}
        <FormSection title="Media" description="Category icon and cover image">
          <FormField
            label="Icon Name"
            hint="Lucide icon name (e.g., FolderTree, Package, Sparkles)"
          >
            <Input
              value={formData.icon}
              onChange={(e) => updateField("icon", e.target.value)}
              placeholder="FolderTree"
              className="border-zinc-300 focus:border-zinc-400"
            />
          </FormField>

          <FormField
            label="Cover Image URL"
            hint="Optional banner image for category page"
          >
            <Input
              value={formData.coverImage}
              onChange={(e) => updateField("coverImage", e.target.value)}
              placeholder="/images/categories/skincare-banner.jpg"
              className="border-zinc-300 focus:border-zinc-400"
            />
          </FormField>
        </FormSection>

        <FormActions
          submitLabel="Update Category"
          submitIcon={
            isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={16} />
            )
          }
          isSubmitting={isSubmitting || !isValid}
          onCancel={() => navigate("/dashboard/categories")}
        />
      </form>
    </ModernFormLayout>
  );
};
