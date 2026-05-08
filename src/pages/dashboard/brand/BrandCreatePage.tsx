import React from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { useCreateBrand } from "@/features/brand";
import {
  ModernFormLayout,
  FormSection,
  FormField,
  FormActions,
} from "@/shared/components/forms/ModernFormLayout";
import {
  EntityFormRenderer,
  type EntityFieldConfig,
} from "@/shared/components/forms/EntityFormRenderer";
import { useEntityForm } from "@/shared/hooks/useEntityForm";
import { slugify } from "@/shared/utils/slug";
import ImageColorPalette from "@/shared/components/color-thief";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  link: z.string().min(1),
  sortOrder: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined)),
  coverImage: z.instanceof(File).nullable().optional(),
  mediaAssets: z.array(z.instanceof(File)).optional(),
});

type FormValues = Readonly<{
  title: string;
  slug: string;
  description: string;
  link: string;
  sortOrder: string;
  coverImage: File | null;
  mediaAssets: File[];
}>;
type SubmitValues = z.output<typeof schema>;

const fields: ReadonlyArray<EntityFieldConfig> = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "description", label: "Description", type: "richtext" },
  { name: "link", label: "Link", type: "text" },
  { name: "sortOrder", label: "Sort Order", type: "text" },
  { name: "coverImage", label: "Cover Image", type: "file", accept: "image/*" },
  {
    name: "mediaAssets",
    label: "Media Assets",
    type: "file",
    multiple: true,
    maxFiles: 8,
  },
];

export const BrandCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const create = useCreateBrand();
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);
  const [dominantColor, setDominantColor] = React.useState("");
  const form = useEntityForm<FormValues, SubmitValues>({
    schema,
    initialValues: {
      title: "",
      slug: "",
      description: "",
      link: "",
      sortOrder: "",
      coverImage: null,
      mediaAssets: [],
    },
    successMessage: "Brand created",
    onSubmit: async (p) => {
      await create.mutateAsync({
        ...p,
        coverImage: p.coverImage ?? null,
        mediaAssets: p.mediaAssets ?? [],
      });
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

  const handleFieldChange = React.useCallback(
    (name: string, value: unknown) => {
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
    },
    [form, slugManuallyEdited],
  );

  return (
    <ModernFormLayout
      title="Create Brand"
      subtitle="Add a new brand to your catalog with complete details, media assets, and branding information."
      eyebrow="Brand Management"
      onBack={() => navigate("/dashboard/brand")}
      stats={[
        { label: "Status", value: "Draft" },
        { label: "Type", value: "New Brand" },
      ]}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.submit();
        }}
        className="space-y-6"
      >
        <FormSection
          title="Basic Information"
          description="Core brand details and identification"
        >
          <EntityFormRenderer
            fields={fields}
            values={form.values as Record<string, unknown>}
            errors={form.errors}
            onFieldChange={handleFieldChange}
          />
        </FormSection>

        {coverImageSrc && (
          <FormSection
            title="Brand Color"
            description="Automatically extracted dominant color from cover image"
          >
            <FormField
              label="Dominant Color"
              hint="This color is extracted from your brand's cover image"
            >
              <input
                value={dominantColor}
                readOnly
                className="w-40 rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm text-zinc-900"
              />
            </FormField>
            <ImageColorPalette
              src={coverImageSrc}
              colorCount={5}
              onDominantColorDetected={setDominantColor}
            />
          </FormSection>
        )}

        <FormActions
          submitLabel="Create Brand"
          submitIcon={
            form.isSubmitting || create.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )
          }
          isSubmitting={form.isSubmitting || create.isPending}
          onCancel={() => navigate("/dashboard/brand")}
        />
      </form>
    </ModernFormLayout>
  );
};
