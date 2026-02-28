import React from "react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useNewsroomGet, useNewsroomList, useUpdateNewsroom } from "@/features/newsroom";
import { FormLayout } from "@/shared/components/forms/FormLayout";
import { EntityFormRenderer, type EntityFieldConfig } from "@/shared/components/forms/EntityFormRenderer";
import { useEntityForm } from "@/shared/hooks/useEntityForm";
import { slugify } from "@/shared/utils/slug";

const schema = z.object({ title:z.string().min(1), slug:z.string().min(1), description:z.string().min(1), sortOrder:z.string().optional().transform(v=>v?Number(v):undefined), removeImage:z.boolean().default(false), image:z.instanceof(File).nullable().optional(), mediaAssets:z.array(z.instanceof(File)).optional() });
type FormValues = Readonly<{ title:string; slug:string; description:string; sortOrder:string; removeImage:boolean; image:File|null; mediaAssets:File[] }>;
type SubmitValues = z.output<typeof schema>;
const fields: ReadonlyArray<EntityFieldConfig> = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "description", label: "Description", type: "richtext" },
  { name: "sortOrder", label: "Sort Order", type: "text" },
  { name: "image", label: "Image", type: "file", accept: "image/*" },
  { name: "mediaAssets", label: "Media Assets", type: "file", multiple: true, maxFiles: 12 },
];
export const NewsroomEditPage: React.FC = () => { const {slug}=useParams<{slug:string}>(); const nav=useNavigate(); const isIdLike=React.useMemo(()=>Boolean(slug&&(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug)||/^[0-9a-f]{24}$/i.test(slug))),[slug]); const find=useNewsroomList({ page: 1, limit: 1, search: slug }, Boolean(slug)); const resolvedId=React.useMemo(()=>{ if(isIdLike) return slug; const rows=find.data?.data??[]; return rows.find((r)=>r.slug===slug)?.id ?? rows[0]?.id; },[find.data?.data, isIdLike, slug]); const q=useNewsroomGet(resolvedId); const m=useUpdateNewsroom(); const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false); const [removedMediaAssetIds, setRemovedMediaAssetIds] = React.useState<ReadonlyArray<string>>([]); const form=useEntityForm<FormValues, SubmitValues>({ schema, initialValues:{title:"",slug:"",description:"",sortOrder:"",removeImage:false,image:null,mediaAssets:[]}, successMessage:"Newsroom updated", onSubmit: async (p)=>{ if(!resolvedId) return; await m.mutateAsync({ id: resolvedId, dto: { ...p, image:p.image??null, mediaAssets:p.mediaAssets??[], removeMediaAssetsIds: removedMediaAssetIds } }); nav('/dashboard/newsroom',{replace:true}); }});
const resetForm = form.reset;
React.useEffect(()=>{ if(!q.data) return; resetForm({ title:q.data.title??"", slug:q.data.slug??"", description:q.data.description??"", sortOrder:q.data.sortOrder!=null?String(q.data.sortOrder):"", removeImage:false, image:null, mediaAssets:[] }); setSlugManuallyEdited(false); setRemovedMediaAssetIds([]); },[q.data, resetForm]);
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
if(!slug) return <div>Invalid slug</div>; if(find.isLoading) return <div>Loading...</div>; if(!resolvedId) return <div>Not found</div>; if(q.isLoading) return <div>Loading...</div>; if(q.isError) return <div>Failed</div>;
return <FormLayout title='Edit Newsroom'><form onSubmit={(e)=>{e.preventDefault(); void form.submit();}} style={{display:'grid',gap:10}}>
  <EntityFormRenderer
    fields={fields}
    values={form.values as Record<string, unknown>}
    errors={form.errors}
    onFieldChange={handleFieldChange}
    onRemoveExistingPreview={(name, index) => {
      if (name === "image") {
        form.setField("removeImage", true);
        form.setField("image", null);
        return;
      }
      if (name === "mediaAssets") {
        const asset = (q.data?.mediaAssets ?? [])[index];
        if (asset?.id) setRemovedMediaAssetIds((prev) => (prev.includes(asset.id) ? prev : [...prev, asset.id]));
      }
    }}
    filePreviewUrls={{
      image: (q.data as { imageUrl?: string; image?: string } | undefined)?.imageUrl ?? (q.data as { imageUrl?: string; image?: string } | undefined)?.image ?? null,
      mediaAssets: (q.data?.mediaAssets ?? []).filter((asset) => !removedMediaAssetIds.includes(asset.id)),
    }}
  />
  <div style={{display:'flex',gap:8}}><button type='submit'>Update</button><button type='button' onClick={()=>nav('/dashboard/newsroom')}>Cancel</button></div>
</form></FormLayout>; };
