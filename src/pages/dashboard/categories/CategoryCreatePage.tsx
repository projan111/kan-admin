import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2, FolderTree } from "lucide-react";
import {
  ModernFormLayout,
  FormSection,
  FormField,
  FormActions,
} from "@/shared/components/forms/ModernFormLayout";
import { Input } from "@/shared/components/ui/input";

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

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const CategoryCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    status: "Active",
    sortOrder: "0",
    icon: "FolderTree",
    coverImage: "",
  });

  const updateField = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };

      // Auto-generate slug from name if not manually edited
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Creating category:", formData);

    setIsSubmitting(false);
    navigate("/dashboard/categories");
  };

  const isValid = formData.name.trim() && formData.slug.trim();

  return (
    <ModernFormLayout
      title="Create Category"
      subtitle="Add a new product category to organize your catalog. Categories can contain multiple subcategories."
      eyebrow="Category Management"
      onBack={() => navigate("/dashboard/categories")}
      stats={[
        { label: "Status", value: formData.status },
        { label: "Type", value: "Main Category" },
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

            <FormField
              label="Slug"
              required
              hint="URL-friendly identifier (auto-generated)"
            >
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

          {formData.coverImage && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-600">
                Preview
              </p>
              <div className="flex h-32 items-center justify-center rounded-lg bg-white">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </FormSection>

        {/* Preview Card */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
              <FolderTree size={28} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-zinc-900">
                {formData.name || "Category Name"}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {formData.description ||
                  "Category description will appear here"}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <span>Slug: {formData.slug || "category-slug"}</span>
                <span>•</span>
                <span>Status: {formData.status}</span>
                <span>•</span>
                <span>Sort: {formData.sortOrder}</span>
              </div>
            </div>
          </div>
        </div>

        <FormActions
          submitLabel="Create Category"
          submitIcon={
            isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )
          }
          isSubmitting={isSubmitting || !isValid}
          onCancel={() => navigate("/dashboard/categories")}
        />
      </form>
    </ModernFormLayout>
  );
};
