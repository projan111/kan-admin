import React from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateContact } from "@/features/contact";
import { FormLayout } from "@/shared/components/forms/FormLayout";
import { EntityFormRenderer, type EntityFieldConfig } from "@/shared/components/forms/EntityFormRenderer";
import { useEntityForm } from "@/shared/hooks/useEntityForm";

const schema = z.object({ name:z.string().min(1), email:z.string().email(), number:z.string().min(1), message:z.string().min(1), sortOrder:z.string().optional().transform(v=>v?Number(v):undefined) });
type FormValues = Readonly<{ name:string; email:string; number:string; message:string; sortOrder:string }>;
type SubmitValues = z.output<typeof schema>;
const fields: ReadonlyArray<EntityFieldConfig> = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "number", label: "Number", type: "text" },
  { name: "message", label: "Message", type: "textarea" },
  { name: "sortOrder", label: "Sort Order", type: "text" },
];
export const ContactCreatePage: React.FC = () => { const nav=useNavigate(); const m=useCreateContact(); const form=useEntityForm<FormValues, SubmitValues>({ schema, initialValues:{ name:"", email:"", number:"", message:"", sortOrder:"" }, successMessage:"Contact created", onSubmit: async (p)=>{ await m.mutateAsync(p); nav('/dashboard/contact',{replace:true}); }});
return <FormLayout title='Create Contact'><form onSubmit={(e)=>{e.preventDefault(); void form.submit();}} style={{display:'grid',gap:10}}>
  <EntityFormRenderer fields={fields} values={form.values as Record<string, unknown>} errors={form.errors} onFieldChange={(name,value)=>form.setField(name as keyof FormValues, value as never)} />
  <div style={{display:'flex',gap:8}}><button type='submit'>Create</button><button type='button' onClick={()=>nav('/dashboard/contact')}>Cancel</button></div>
</form></FormLayout>; };
