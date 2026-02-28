import React from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateBrand } from "@/features/brand";
import { FormLayout } from "@/shared/components/forms/FormLayout";
import { EntityFormRenderer, type EntityFieldConfig } from "@/shared/components/forms/EntityFormRenderer";
import { useEntityForm } from "@/shared/hooks/useEntityForm";
import { slugify } from "@/shared/utils/slug";
import ImageColorPalette from "@/shared/components/color-thief";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  link: z.string().min(1),
  sortOrder: z.string().optional().transform((v) => (v ? Number(v) : undefined)),
  coverImage: z.instanceof(File).nullable().optional(),
  mediaAssets: z.array(z.instanceof(File)).optional(),
});

type FormValues = Readonly<{ title: string; slug: string; description: string; link: string; sortOrder: string; coverImage: File | null; mediaAssets: File[] }>;
type SubmitValues = z.output<typeof schema>;

const fields: ReadonlyArray<EntityFieldConfig> = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "description", label: "Description", type: "richtext" },
  { name: "link", label: "Link", type: "text" },
  { name: "sortOrder", label: "Sort Order", type: "text" },
  { name: "coverImage", label: "Cover Image", type: "file", accept: "image/*" },
  { name: "mediaAssets", label: "Media Assets", type: "file", multiple: true, maxFiles: 8 },
];

export const BrandCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const create = useCreateBrand();
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);
  const [dominantColor, setDominantColor] = React.useState("");
  const form = useEntityForm<FormValues, SubmitValues>({
    schema,
    initialValues: { title: "", slug: "", description: "", link: "", sortOrder: "", coverImage: null, mediaAssets: [] },
    successMessage: "Brand created",
    onSubmit: async (p) => {
      await create.mutateAsync({ ...p, coverImage: p.coverImage ?? null, mediaAssets: p.mediaAssets ?? [] });
      navigate("/dashboard/brand", { replace: true });
    },
  });
  const coverImageSrc = React.useMemo(() => {
    if (!(form.values.coverImage instanceof File)) return "";
    return URL.createObjectURL(form.values.coverImage);
  }, [form.values.coverImage]);
  React.useEffect(() => {
    return () => {
      if (coverImageSrc) URL.revokeObjectURL(coverImageSrc);
    };
  }, [coverImageSrc]);

  const handleFieldChange = React.useCallback((name: string, value: unknown) => {
    if (name === "title") {
      const nextTitle = String(value ?? "");
      form.setField("title", nextTitle);
      if (!slugManuallyEdited) form.setField("slug", slugify(nextTitle));
      return;
    }

    if (name === "slug") {
      setSlugManuallyEdited(true);
      form.setField("slug", slugify(String(value ?? "")));
      return;
    }

    form.setField(name as keyof FormValues, value as never);
  }, [form, slugManuallyEdited]);

  return (
    <FormLayout title="Create Brand">
      <form onSubmit={(e) => { e.preventDefault(); void form.submit(); }} style={{ display: "grid", gap: 10 }}>
        <EntityFormRenderer
          fields={fields}
          values={form.values as Record<string, unknown>}
          errors={form.errors}
          onFieldChange={handleFieldChange}
        />
        {coverImageSrc ? (
          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 13 }}>
              Brand Color<span style={{ color: "var(--primary)", marginLeft: 4 }}>*</span>
            </label>
            <input value={dominantColor} readOnly style={{ width: 160, padding: "8px 10px", border: "1px solid #cbd5e1", background: "#fff" }} />
            <ImageColorPalette src={coverImageSrc} colorCount={5} onDominantColorDetected={setDominantColor} />
          </div>
        ) : null}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={form.isSubmitting || create.isPending}
            className="bg-primary text-white px-4 py-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {form.isSubmitting || create.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
            {form.isSubmitting || create.isPending ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            disabled={form.isSubmitting || create.isPending}
            className="border-primary border px-4 py-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => navigate("/dashboard/brand")}
          >
            Cancel
          </button>
        </div>
      </form>
    </FormLayout>
  );
};
