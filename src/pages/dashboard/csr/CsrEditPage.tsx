import React from "react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCsrGet, useCsrList, useUpdateCsr } from "@/features/csr";
import { FormLayout } from "@/shared/components/forms/FormLayout";
import { EntityFormRenderer, type EntityFieldConfig } from "@/shared/components/forms/EntityFormRenderer";
import { useEntityForm } from "@/shared/hooks/useEntityForm";
import { slugify } from "@/shared/utils/slug";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  link: z.string().min(1),
  status: z.enum(["ONGOING", "UPCOMING", "PREVIOUS"]),
  date: z.string().min(1),
  sortOrder: z.string().optional().transform((v) => (v ? Number(v) : undefined)),
  removeCoverImage: z.boolean().default(false),
  coverImage: z.instanceof(File).nullable().optional(),
  mediaAssets: z.array(z.instanceof(File)).optional(),
});

type FormValues = Readonly<{
  title: string;
  slug: string;
  description: string;
  link: string;
  status: "ONGOING" | "UPCOMING" | "PREVIOUS";
  date: string;
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
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "ONGOING", value: "ONGOING" },
      { label: "UPCOMING", value: "UPCOMING" },
      { label: "PREVIOUS", value: "PREVIOUS" },
    ],
  },
  { name: "date", label: "Date", type: "date" },
  { name: "sortOrder", label: "Sort Order", type: "text" },
  { name: "coverImage", label: "Cover Image", type: "file", accept: "image/*" },
  { name: "mediaAssets", label: "Media Assets", type: "file", multiple: true, maxFiles: 12 },
];

export const CsrEditPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const nav = useNavigate();
  const isIdLike = React.useMemo(
    () => Boolean(slug && (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug) || /^[0-9a-f]{24}$/i.test(slug))),
    [slug]
  );
  const find = useCsrList({ page: 1, limit: 1, search: slug }, Boolean(slug));
  const resolvedId = React.useMemo(() => {
    if (isIdLike) return slug;
    const rows = find.data?.data ?? [];
    return rows.find((r) => r.slug === slug)?.id ?? rows[0]?.id;
  }, [find.data?.data, isIdLike, slug]);
  const q = useCsrGet(resolvedId);
  const m = useUpdateCsr();
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);
  const [removedMediaAssetIds, setRemovedMediaAssetIds] = React.useState<ReadonlyArray<string>>([]);

  const form = useEntityForm<FormValues, SubmitValues>({
    schema,
    initialValues: {
      title: "",
      slug: "",
      description: "",
      link: "",
      status: "ONGOING",
      date: "",
      sortOrder: "",
      removeCoverImage: false,
      coverImage: null,
      mediaAssets: [],
    },
    successMessage: "CSR updated",
    onSubmit: async (p) => {
      if (!resolvedId) return;
      await m.mutateAsync({
        id: resolvedId,
        dto: { ...p, coverImage: p.coverImage ?? null, mediaAssets: p.mediaAssets ?? [], removeMediaAssetsIds: removedMediaAssetIds },
      });
      nav("/dashboard/csr", { replace: true });
    },
  });
  const resetForm = form.reset;

  React.useEffect(() => {
    if (!q.data) return;
    resetForm({
      title: q.data.title ?? "",
      slug: q.data.slug ?? "",
      description: q.data.description ?? "",
      link: q.data.link ?? "",
      status: q.data.status ?? "ONGOING",
      date: q.data.date ?? "",
      sortOrder: q.data.sortOrder != null ? String(q.data.sortOrder) : "",
      removeCoverImage: false,
      coverImage: null,
      mediaAssets: [],
    });
    setSlugManuallyEdited(false);
    setRemovedMediaAssetIds([]);
  }, [q.data, resetForm]);

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

  if (!slug) return <div>Invalid slug</div>;
  if (find.isLoading) return <div>Loading...</div>;
  if (!resolvedId) return <div>Not found</div>;
  if (q.isLoading) return <div>Loading...</div>;
  if (q.isError) return <div>Failed</div>;

  return (
    <FormLayout title="Edit CSR">
      <form onSubmit={(e) => { e.preventDefault(); void form.submit(); }} style={{ display: "grid", gap: 10 }}>
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
              const asset = (q.data?.mediaAssets ?? [])[index];
              if (asset?.id) setRemovedMediaAssetIds((prev) => (prev.includes(asset.id) ? prev : [...prev, asset.id]));
            }
          }}
          filePreviewUrls={{
            coverImage: form.values.removeCoverImage
              ? null
              : ((q.data as { coverImageUrl?: string; coverImage?: string; image?: string } | undefined)?.coverImageUrl ??
                (q.data as { coverImageUrl?: string; coverImage?: string; image?: string } | undefined)?.coverImage ??
                (q.data as { coverImageUrl?: string; coverImage?: string; image?: string } | undefined)?.image ??
                null),
            mediaAssets: (q.data?.mediaAssets ?? []).filter((asset) => !removedMediaAssetIds.includes(asset.id)),
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={form.isSubmitting || m.isPending}
            className="bg-primary text-white px-4 py-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {form.isSubmitting || m.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
            {form.isSubmitting || m.isPending ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            disabled={form.isSubmitting || m.isPending}
            className="border-primary border px-4 py-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => nav("/dashboard/csr")}
          >
            Cancel
          </button>
        </div>
      </form>
    </FormLayout>
  );
};
