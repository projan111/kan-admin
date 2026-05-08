import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Loader2, Layers } from "lucide-react";
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
  status: "Active" | "Inactive";
  sortOrder: string;
  icon: string;
};

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const SubcategoryCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { id: categoryId } = useParams();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    slug: "",
    description: "",
    status: "Active",
    sortOrder: "0",
    icon: "Layers",
  });

  // Mock parent category name
  const parentCategoryName = "Skincare";

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
    console.log("Creating subcategory:", { categoryId, ...formData });
    setIsSubmitting(false);
    navigate(`/dashboard/categories/${categoryId}`);
  };

  const isValid = formData.name.trim() && formData.slug.trim();

  return (
    <ModernFormLayout
      title="Create Subcategory"
      subtitle={`Add a new subcategory under ${parentCategoryName}. Subcategories help organize products within a main category.`}
      eyebrow="Subcategory Management"
      onBack={() => navigate(`/dashboard/categories/${categoryId}`)}
      stats={[
        { label: "Parent Category", value: parentCategoryName },
        { label: "Status", value: formData.status },
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <FormSection
          title="Basic Information"
          description="Core subcategory details and identification"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Subcategory Name"
              required
              hint="Display name for the subcategory"
            >
              <Input
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g., Moisturizers, Cleansers, Serums"
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
                placeholder="e.g., moisturizers, cleansers, serums"
                className="border-zinc-300 focus:border-zinc-400"
              />
            </FormField>
          </div>

          <FormField
            label="Description"
            hint="Brief description of what products belong in this subcategory"
          >
            <textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the subcategory and what products it contains..."
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

        {/* Display Settings */}
        <FormSection
          title="Display Settings"
          description="Visual appearance and icon"
        >
          <FormField
            label="Icon Name"
            hint="Lucide icon name (e.g., Layers, Package, Sparkles)"
          >
            <Input
              value={formData.icon}
              onChange={(e) => updateField("icon", e.target.value)}
              placeholder="Layers"
              className="border-zinc-300 focus:border-zinc-400"
            />
          </FormField>
        </FormSection>

        {/* Preview Card */}
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100">
              <Layers size={28} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">
                  {parentCategoryName}
                </span>
                <span className="text-slate-400">→</span>
                <span className="text-xs font-semibold text-purple-700">
                  {formData.name || "Subcategory Name"}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">
                {formData.name || "Subcategory Name"}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {formData.description ||
                  "Subcategory description will appear here"}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <span>Slug: {formData.slug || "subcategory-slug"}</span>
                <span>•</span>
                <span>Status: {formData.status}</span>
                <span>•</span>
                <span>Sort: {formData.sortOrder}</span>
              </div>
            </div>
          </div>
        </div>

        <FormActions
          submitLabel="Create Subcategory"
          submitIcon={
            isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )
          }
          isSubmitting={isSubmitting || !isValid}
          onCancel={() => navigate(`/dashboard/categories/${categoryId}`)}
        />
      </form>
    </ModernFormLayout>
  );
};
