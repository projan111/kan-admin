import React from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateNewsroom } from "@/features/newsroom";
import { FormLayout } from "@/shared/components/forms/FormLayout";
import { EntityFormRenderer, type EntityFieldConfig } from "@/shared/components/forms/EntityFormRenderer";
import { useEntityForm } from "@/shared/hooks/useEntityForm";
import { slugify } from "@/shared/utils/slug";

const schema = z.object({ title:z.string().min(1), slug:z.string().min(1), description:z.string().min(1), sortOrder:z.string().optional().transform(v=>v?Number(v):undefined), image:z.instanceof(File).nullable().optional(), mediaAssets:z.array(z.instanceof(File)).optional() });
type FormValues = Readonly<{ title:string; slug:string; description:string; sortOrder:string; image:File|null; mediaAssets:File[] }>;
type SubmitValues = z.output<typeof schema>;
const fields: ReadonlyArray<EntityFieldConfig> = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "description", label: "Description", type: "richtext" },
  { name: "sortOrder", label: "Sort Order", type: "text" },
  { name: "image", label: "Image", type: "file", accept: "image/*" },
  { name: "mediaAssets", label: "Media Assets", type: "file", multiple: true, maxFiles: 12 },
];
export const NewsroomCreatePage: React.FC = () => { const nav=useNavigate(); const m=useCreateNewsroom(); const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false); const form=useEntityForm<FormValues, SubmitValues>({ schema, initialValues:{title:"",slug:"",description:"",sortOrder:"",image:null,mediaAssets:[]}, successMessage:"Newsroom created", onSubmit: async (p)=>{ await m.mutateAsync({ ...p, image:p.image??null, mediaAssets:p.mediaAssets??[] }); nav('/dashboard/newsroom',{replace:true}); }});
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
return <FormLayout title='Create Newsroom'><form onSubmit={(e)=>{e.preventDefault(); void form.submit();}} style={{display:'grid',gap:10}}>
  <EntityFormRenderer fields={fields} values={form.values as Record<string, unknown>} errors={form.errors} onFieldChange={handleFieldChange} />
  <div style={{display:'flex',gap:8}}><button type='submit'>Create</button><button type='button' onClick={()=>nav('/dashboard/newsroom')}>Cancel</button></div>
</form></FormLayout>; };
