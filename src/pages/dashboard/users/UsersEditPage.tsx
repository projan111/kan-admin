import React from "react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminUsersGet, useUpdateAdminUser } from "@/features/adminUsers";
import { FormLayout } from "@/shared/components/forms/FormLayout";
import { EntityFormRenderer, type EntityFieldConfig } from "@/shared/components/forms/EntityFormRenderer";
import { Button } from "@/shared/components/ui/button";
import { useEntityForm } from "@/shared/hooks/useEntityForm";

const schema = z.object({ firstname:z.string().min(1), middlename:z.string().optional(), lastname:z.string().min(1), email:z.string().email(), phone:z.string().min(1), address:z.string().min(1), gender:z.enum(["MALE","FEMALE","OTHER"]), role:z.enum(["SUDOADMIN","ADMIN","USER"]), isVerified:z.boolean().default(false), sortOrder:z.string().optional().transform(v=>v?Number(v):undefined), profile:z.instanceof(File).nullable().optional() });
type FormValues = Readonly<{ firstname:string; middlename:string; lastname:string; email:string; phone:string; address:string; gender:"MALE"|"FEMALE"|"OTHER"; role:"SUDOADMIN"|"ADMIN"|"USER"; isVerified:boolean; sortOrder:string; profile:File|null }>;
type SubmitValues = z.output<typeof schema>;
const fields: ReadonlyArray<EntityFieldConfig> = [
  { name: "firstname", label: "First Name", type: "text" },
  { name: "middlename", label: "Middle Name", type: "text" },
  { name: "lastname", label: "Last Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "gender", label: "Gender", type: "select", options: [{label:"MALE",value:"MALE"},{label:"FEMALE",value:"FEMALE"},{label:"OTHER",value:"OTHER"}] },
  { name: "role", label: "Role", type: "select", options: [{label:"USER",value:"USER"},{label:"ADMIN",value:"ADMIN"},{label:"SUDOADMIN",value:"SUDOADMIN"}] },
  { name: "isVerified", label: "Verified", type: "checkbox" },
  { name: "sortOrder", label: "Sort Order", type: "text" },
  { name: "profile", label: "Profile", type: "file", accept: "image/*" },
];
export const UsersEditPage: React.FC = () => { const {id}=useParams<{id:string}>(); const nav=useNavigate(); const q=useAdminUsersGet(id); const m=useUpdateAdminUser(); const form=useEntityForm<FormValues, SubmitValues>({ schema, initialValues:{ firstname:"", middlename:"", lastname:"", email:"", phone:"", address:"", gender:"MALE", role:"USER", isVerified:false, sortOrder:"", profile:null }, successMessage:"User updated", onSubmit: async (p)=>{ if(!id) return; await m.mutateAsync({ id, payload: { ...p, profile:p.profile??null } }); nav('/dashboard/users',{replace:true}); }});
const resetForm = form.reset;
React.useEffect(()=>{ if(!q.data) return; resetForm({ firstname:q.data.firstname??"", middlename:q.data.middlename??"", lastname:q.data.lastname??"", email:q.data.email??"", phone:q.data.phone??"", address:q.data.address??"", gender:q.data.gender??"MALE", role:q.data.role??"USER", isVerified:Boolean(q.data.isVerified), sortOrder:q.data.sortOrder!=null?String(q.data.sortOrder):"", profile:null }); },[q.data, resetForm]);
const profilePreviewUrl = React.useMemo(() => {
  const row = (q.data ?? null) as
    | (Record<string, unknown> & { profileUrl?: string; profilePicture?: string | Record<string, unknown> })
    | null;
  if (!row) return null;
  const direct =
    (typeof row.profileUrl === "string" && row.profileUrl) ||
    (typeof row.profilePicture === "string" && row.profilePicture) ||
    (typeof row.profile === "string" && row.profile) ||
    (typeof row.avatar === "string" && row.avatar) ||
    (typeof row.image === "string" && row.image);
  if (direct) return direct;
  if (row.profilePicture && typeof row.profilePicture === "object") {
    const p = row.profilePicture as Record<string, unknown>;
    return (
      (typeof p.url === "string" && p.url) ||
      (typeof p.fileUrl === "string" && p.fileUrl) ||
      (typeof p.imageUrl === "string" && p.imageUrl) ||
      null
    );
  }
  if (row.profile && typeof row.profile === "object") {
    const p = row.profile as Record<string, unknown>;
    return (
      (typeof p.url === "string" && p.url) ||
      (typeof p.fileUrl === "string" && p.fileUrl) ||
      (typeof p.imageUrl === "string" && p.imageUrl) ||
      null
    );
  }
  return null;
}, [q.data]);
if(!id) return <div>Invalid id</div>; if(q.isLoading) return <div>Loading...</div>; if(q.isError) return <div>Failed</div>;
return <FormLayout title='Edit User'><form onSubmit={(e)=>{e.preventDefault(); void form.submit();}} style={{display:'grid',gap:10}}>
  <EntityFormRenderer
    fields={fields}
    values={form.values as Record<string, unknown>}
    errors={form.errors}
    onFieldChange={(name,value)=>form.setField(name as keyof FormValues, value as never)}
    onRemoveExistingPreview={(name) => {
      if (name !== "profile") return;
      form.setField("profile", null);
    }}
    filePreviewUrls={{ profile: profilePreviewUrl }}
  />
  <div style={{display:'flex',gap:8}}>
    <Button type="submit">Update</Button>
    <Button type="button" variant="outline" onClick={() => nav('/dashboard/users')}>Cancel</Button>
  </div>
</form></FormLayout>; };
