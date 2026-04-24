import React from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateCsr } from "@/features/csr";
import { FormLayout } from "@/shared/components/forms/FormLayout";
import { EntityFormRenderer, type EntityFieldConfig } from "@/shared/components/forms/EntityFormRenderer";
import { Button } from "@/shared/components/ui/button";
import { useEntityForm } from "@/shared/hooks/useEntityForm";
import { slugify } from "@/shared/utils/slug";

const schema = z.object({ title:z.string().min(1), slug:z.string().min(1), description:z.string().min(1), link:z.string().min(1), status:z.enum(["ONGOING","UPCOMING","PREVIOUS"]), date:z.string().min(1), sortOrder:z.string().optional().transform(v=>v?Number(v):undefined), coverImage:z.instanceof(File).nullable().optional(), mediaAssets:z.array(z.instanceof(File)).optional() });
type FormValues = Readonly<{ title:string; slug:string; description:string; link:string; status:"ONGOING"|"UPCOMING"|"PREVIOUS"; date:string; sortOrder:string; coverImage:File|null; mediaAssets:File[] }>;
type SubmitValues = z.output<typeof schema>;
const fields: ReadonlyArray<EntityFieldConfig> = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "description", label: "Description", type: "richtext" },
  { name: "link", label: "Link", type: "text" },
  { name: "status", label: "Status", type: "select", options: [{label:"ONGOING",value:"ONGOING"},{label:"UPCOMING",value:"UPCOMING"},{label:"PREVIOUS",value:"PREVIOUS"}] },
  { name: "date", label: "Date", type: "date" },
  { name: "sortOrder", label: "Sort Order", type: "text" },
  { name: "coverImage", label: "Cover Image", type: "file", accept: "image/*" },
  { name: "mediaAssets", label: "Media Assets", type: "file", multiple: true, maxFiles: 12 },
];
export const CsrCreatePage: React.FC = () => {
  const nav=useNavigate(); const m=useCreateCsr();
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);
  const form=useEntityForm<FormValues, SubmitValues>({ schema, initialValues:{title:"",slug:"",description:"",link:"",status:"ONGOING",date:"",sortOrder:"",coverImage:null,mediaAssets:[]}, successMessage:"CSR created", onSubmit: async (p)=>{ await m.mutateAsync({ ...p, coverImage:p.coverImage??null, mediaAssets:p.mediaAssets??[] }); nav('/dashboard/csr',{replace:true}); }});
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
  return <FormLayout title='Create CSR'><form onSubmit={(e)=>{e.preventDefault(); void form.submit();}} style={{display:'grid',gap:10}}>
    <EntityFormRenderer fields={fields} values={form.values as Record<string, unknown>} errors={form.errors} onFieldChange={handleFieldChange} />
    <div style={{display:'flex',gap:8}}>
      <Button type="submit">Create</Button>
      <Button type="button" variant="outline" onClick={() => nav('/dashboard/csr')}>Cancel</Button>
    </div>
  </form></FormLayout>;
};
