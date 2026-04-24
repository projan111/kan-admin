import React from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateAdminUser } from "@/features/adminUsers";
import { FormLayout } from "@/shared/components/forms/FormLayout";
import { EntityFormRenderer, type EntityFieldConfig } from "@/shared/components/forms/EntityFormRenderer";
import { Button } from "@/shared/components/ui/button";
import { useEntityForm } from "@/shared/hooks/useEntityForm";

const schema = z.object({ firstname:z.string().min(1), middlename:z.string().optional(), lastname:z.string().min(1), email:z.string().email(), phone:z.string().min(1), password:z.string().min(6), address:z.string().min(1), gender:z.enum(["MALE","FEMALE","OTHER"]), role:z.enum(["SUDOADMIN","ADMIN","USER"]), isVerified:z.boolean().default(true), sortOrder:z.string().optional().transform(v=>v?Number(v):undefined), profile:z.instanceof(File).nullable().optional() });
type FormValues = Readonly<{ firstname:string; middlename:string; lastname:string; email:string; phone:string; password:string; address:string; gender:"MALE"|"FEMALE"|"OTHER"; role:"SUDOADMIN"|"ADMIN"|"USER"; isVerified:boolean; sortOrder:string; profile:File|null }>;
type SubmitValues = z.output<typeof schema>;
const fields: ReadonlyArray<EntityFieldConfig> = [
  { name: "firstname", label: "First Name", type: "text" },
  { name: "middlename", label: "Middle Name", type: "text" },
  { name: "lastname", label: "Last Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "password", label: "Password", type: "password" },
  { name: "address", label: "Address", type: "text" },
  { name: "gender", label: "Gender", type: "select", options: [{label:"MALE",value:"MALE"},{label:"FEMALE",value:"FEMALE"},{label:"OTHER",value:"OTHER"}] },
  { name: "role", label: "Role", type: "select", options: [{label:"USER",value:"USER"},{label:"ADMIN",value:"ADMIN"},{label:"SUDOADMIN",value:"SUDOADMIN"}] },
  { name: "isVerified", label: "Verified", type: "checkbox" },
  { name: "sortOrder", label: "Sort Order", type: "text" },
  { name: "profile", label: "Profile", type: "file", accept: "image/*" },
];
export const UsersCreatePage: React.FC = () => { const nav=useNavigate(); const m=useCreateAdminUser(); const form=useEntityForm<FormValues, SubmitValues>({ schema, initialValues:{ firstname:"", middlename:"", lastname:"", email:"", phone:"", password:"", address:"", gender:"MALE", role:"USER", isVerified:true, sortOrder:"", profile:null }, successMessage:"User created", onSubmit: async (p)=>{ await m.mutateAsync({ ...p, profile:p.profile??null }); nav('/dashboard/users',{replace:true}); }});
return <FormLayout title='Create User'><form onSubmit={(e)=>{e.preventDefault(); void form.submit();}} style={{display:'grid',gap:10}}>
  <EntityFormRenderer fields={fields} values={form.values as Record<string, unknown>} errors={form.errors} onFieldChange={(name,value)=>form.setField(name as keyof FormValues, value as never)} />
  <div style={{display:'flex',gap:8}}>
    <Button type="submit">Create</Button>
    <Button type="button" variant="outline" onClick={() => nav('/dashboard/users')}>Cancel</Button>
  </div>
</form></FormLayout>; };
