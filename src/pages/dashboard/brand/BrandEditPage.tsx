import React from "react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import { useBrandGet, useBrandList, useUpdateBrand } from "@/features/brand";
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
  removeCoverImage: z.boolean().default(false),
  coverImage: z.instanceof(File).nullable().optional(),
  mediaAssets: z.array(z.instanceof(File)).optional(),
});

type FormValues = Readonly<{
  title: string;
  slug: string;
  description: string;
  link: string;
  sortOrder: string;
  removeCoverImage: boolean;
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

export const BrandEditPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const isIdLike = React.useMemo(
    () =>
      Boolean(
        slug &&
        (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          slug,
        ) ||
          /^[0-9a-f]{24}$/i.test(slug)),
      ),
    [slug],
  );
  const find = useBrandList({ page: 1, limit: 1, search: slug }, Boolean(slug));
  const resolvedId = React.useMemo(() => {
    if (isIdLike) return slug;
    const rows = find.data?.data ?? [];
    return rows.find((r) => r.slug === slug)?.id ?? rows[0]?.id;
  }, [find.data?.data, isIdLike, slug]);
  const navigate = useNavigate();
  const get = useBrandGet(resolvedId);
  const update = useUpdateBrand();
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);
  const [removedMediaAssetIds, setRemovedMediaAssetIds] = React.useState<
    ReadonlyArray<string>
  >([]);
  const [dominantColor, setDominantColor] = React.useState("");

  const form = useEntityForm<FormValues, SubmitValues>({
    schema,
    initialValues: {
      title: "",
      slug: "",
      description: "",
      link: "",
      sortOrder: "",
      removeCoverImage: false,
      coverImage: null,
      mediaAssets: [],
    },
    successMessage: "Brand updated",
    onSubmit: async (p) => {
      if (!resolvedId) return;
      await update.mutateAsync({
        id: resolvedId,
        dto: {
          ...p,
          coverImage: p.coverImage ?? null,
          mediaAssets: p.mediaAssets ?? [],
          removeMediaAssetsIds: removedMediaAssetIds,
        },
      });
      navigate("/dashboard/brand", { replace: true });
    },
  });
  const resetForm = form.reset;
  const coverImageSrc = React.useMemo(() => {
    if (form.values.coverImage instanceof File)
      return URL.createObjectURL(form.values.coverImage);
    if (form.values.removeCoverImage) return "";
    return (
      (
        get.data as
          | { coverImage?: string; coverImageUrl?: string; image?: string }
          | undefined
      )?.coverImage ??
      (
        get.data as
          | { coverImage?: string; coverImageUrl?: string; image?: string }
          | undefined
      )?.coverImageUrl ??
      (
        get.data as
          | { coverImage?: string; coverImageUrl?: string; image?: string }
          | undefined
      )?.image ??
      ""
    );
  }, [form.values.coverImage, form.values.removeCoverImage, get.data]);
  React.useEffect(() => {
    return () => {
      if (form.values.coverImage instanceof File && coverImageSrc)
        URL.revokeObjectURL(coverImageSrc);
    };
  }, [coverImageSrc, form.values.coverImage]);

  React.useEffect(() => {
    if (!get.data) return;
    resetForm({
      title: get.data.title ?? "",
      slug: get.data.slug ?? "",
      description: get.data.description ?? "",
      link: get.data.link ?? "",
      sortOrder: get.data.sortOrder != null ? String(get.data.sortOrder) : "",
      removeCoverImage: false,
      coverImage: null,
      mediaAssets: [],
    });
    setSlugManuallyEdited(false);
    setRemovedMediaAssetIds([]);
    const existingColor =
      (
        get.data as
          | { dominantColor?: string; color?: string; bgcolor?: string }
          | undefined
      )?.dominantColor ??
      (
        get.data as
          | { dominantColor?: string; color?: string; bgcolor?: string }
          | undefined
      )?.color ??
      (
        get.data as
          | { dominantColor?: string; color?: string; bgcolor?: string }
          | undefined
      )?.bgcolor ??
      "";
    setDominantColor(existingColor);
  }, [get.data, resetForm]);

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

  if (!slug)
    return <div className="p-6 text-center text-slate-600">Invalid slug</div>;
  if (find.isLoading)
    return <div className="p-6 text-center text-slate-600">Loading...</div>;
  if (!resolvedId)
    return <div className="p-6 text-center text-slate-600">Not found</div>;
  if (get.isLoading)
    return <div className="p-6 text-center text-slate-600">Loading...</div>;
  if (get.isError)
    return <div className="p-6 text-center text-red-600">Failed to load</div>;

  return (
    <ModernFormLayout
      title="Edit Brand"
      subtitle="Update brand information, media assets, and branding details."
      eyebrow="Brand Management"
      onBack={() => navigate("/dashboard/brand")}
      stats={[
        { label: "Status", value: "Active" },
        { label: "Last Updated", value: "Today" },
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
            onRemoveExistingPreview={(name, index) => {
              if (name === "coverImage") {
                form.setField("removeCoverImage", true);
                form.setField("coverImage", null);
                return;
              }
              if (name === "mediaAssets") {
                const assets = (get.data?.mediaAssets ??
                  []) as ReadonlyArray<unknown>;
                const asset = assets[index] as { id?: string } | undefined;
                if (asset?.id) {
                  setRemovedMediaAssetIds((prev) =>
                    prev.includes(asset.id as string)
                      ? prev
                      : [...prev, asset.id as string],
                  );
                }
              }
            }}
            filePreviewUrls={{
              coverImage: form.values.removeCoverImage
                ? null
                : ((
                    get.data as
                      | {
                          coverImage?: string;
                          coverImageUrl?: string;
                          image?: string;
                        }
                      | undefined
                  )?.coverImage ??
                  (
                    get.data as
                      | {
                          coverImage?: string;
                          coverImageUrl?: string;
                          image?: string;
                        }
                      | undefined
                  )?.coverImageUrl ??
                  (
                    get.data as
                      | {
                          coverImage?: string;
                          coverImageUrl?: string;
                          image?: string;
                        }
                      | undefined
                  )?.image ??
                  null),
              mediaAssets: (
                (get.data?.mediaAssets ?? []) as ReadonlyArray<unknown>
              ).filter((a) => {
                const id = (a as { id?: string })?.id;
                return !id || !removedMediaAssetIds.includes(id);
              }),
            }}
          />
        </FormSection>

        {(coverImageSrc || dominantColor) && (
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
            {coverImageSrc && (
              <ImageColorPalette
                src={coverImageSrc}
                colorCount={5}
                onDominantColorDetected={(color) => {
                  if (color) setDominantColor(color);
                }}
              />
            )}
          </FormSection>
        )}

        <FormActions
          submitLabel="Update Brand"
          submitIcon={
            form.isSubmitting || update.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={16} />
            )
          }
          isSubmitting={form.isSubmitting || update.isPending}
          onCancel={() => navigate("/dashboard/brand")}
        />
      </form>
    </ModernFormLayout>
  );
};
