import React from "react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useCompanyGet, useCompanyList, useUpdateCompany } from "@/features/company";
import { FormLayout } from "@/shared/components/forms/FormLayout";
import { EntityFormRenderer, type EntityFieldConfig } from "@/shared/components/forms/EntityFormRenderer";
import { useEntityForm } from "@/shared/hooks/useEntityForm";
import { slugify } from "@/shared/utils/slug";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  link: z.string().min(1),
  bgcolor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color"),
  sortOrder: z.string().optional().transform(v=>v?Number(v):undefined),
  removeLogo: z.boolean().default(false),
  logo: z.instanceof(File).nullable().optional(),
});
type FormValues = Readonly<{ title:string; slug:string; description:string; link:string; bgcolor:string; sortOrder:string; removeLogo:boolean; logo: File | null }>;
type SubmitValues = z.output<typeof schema>;
const fields: ReadonlyArray<EntityFieldConfig> = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "description", label: "Description", type: "richtext" },
  { name: "link", label: "Link", type: "text" },
  { name: "bgcolor", label: "Bg Color", type: "text" },
  { name: "sortOrder", label: "Sort Order", type: "text" },
  { name: "logo", label: "Logo", type: "file", accept: "image/*" },
];
export const CompanyEditPage: React.FC = () => {
  const {slug}=useParams<{slug:string}>(); const nav=useNavigate(); const isIdLike=React.useMemo(()=>Boolean(slug&&(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug)||/^[0-9a-f]{24}$/i.test(slug))),[slug]); const find=useCompanyList({ page: 1, limit: 1, search: slug }, Boolean(slug)); const resolvedId=React.useMemo(()=>{ if(isIdLike) return slug; const rows=find.data?.data??[]; return rows.find((r)=>r.slug===slug)?.id ?? rows[0]?.id; },[find.data?.data, isIdLike, slug]); const q=useCompanyGet(resolvedId); const m=useUpdateCompany();
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);
  const form = useEntityForm<FormValues, SubmitValues>({ schema, initialValues:{ title:"", slug:"", description:"", link:"", bgcolor:"#ffffff", sortOrder:"", removeLogo:false, logo:null }, successMessage:"Company updated", onSubmit: async (p)=>{ if(!resolvedId) return; await m.mutateAsync({ id: resolvedId, dto: { ...p, bgcolor: p.bgcolor as `#${string}`, logo: p.logo ?? null } }); nav('/dashboard/company',{replace:true}); }});
  const resetForm = form.reset;
  React.useEffect(()=>{ if(!q.data) return; resetForm({ title:q.data.title??"", slug:q.data.slug??"", description:q.data.description??"", link:q.data.link??"", bgcolor:q.data.bgcolor??"#ffffff", sortOrder:q.data.sortOrder!=null?String(q.data.sortOrder):"", removeLogo:false, logo:null }); setSlugManuallyEdited(false); },[q.data, resetForm]);
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
  return <FormLayout title='Edit Company'><form onSubmit={(e)=>{e.preventDefault(); void form.submit();}} style={{display:'grid',gap:10}}>
    <EntityFormRenderer
      fields={fields}
      values={form.values as Record<string, unknown>}
      errors={form.errors}
      onFieldChange={handleFieldChange}
      onRemoveExistingPreview={(name) => {
        if (name !== "logo") return;
        form.setField("removeLogo", true);
        form.setField("logo", null);
      }}
      filePreviewUrls={{ logo: q.data?.logoUrl ?? null }}
    />
    <div style={{display:'flex',gap:8}}><button type='submit'>Update</button><button type='button' onClick={()=>nav('/dashboard/company')}>Cancel</button></div>
  </form></FormLayout>;
};
