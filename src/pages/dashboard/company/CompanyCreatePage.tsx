import React from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateCompany } from "@/features/company";
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
  logo: z.instanceof(File).nullable().optional(),
});
type FormValues = Readonly<{ title:string; slug:string; description:string; link:string; bgcolor:string; sortOrder:string; logo: File | null }>;
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
export const CompanyCreatePage: React.FC = () => {
  const nav = useNavigate(); const m = useCreateCompany();
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);
  const form = useEntityForm<FormValues, SubmitValues>({ schema, initialValues:{ title:"", slug:"", description:"", link:"", bgcolor:"#ffffff", sortOrder:"", logo:null }, successMessage:"Company created", onSubmit: async (p)=>{ await m.mutateAsync({ ...p, bgcolor: p.bgcolor as `#${string}`, logo: p.logo ?? null }); nav('/dashboard/company',{replace:true}); }});
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
  return <FormLayout title="Create Company"><form onSubmit={(e)=>{e.preventDefault(); void form.submit();}} style={{display:'grid',gap:10}}>
    <EntityFormRenderer fields={fields} values={form.values as Record<string, unknown>} errors={form.errors} onFieldChange={handleFieldChange} />
    <div style={{display:'flex',gap:8}}><button type='submit'>Create</button><button type='button' onClick={()=>nav('/dashboard/company')}>Cancel</button></div>
  </form></FormLayout>;
};
