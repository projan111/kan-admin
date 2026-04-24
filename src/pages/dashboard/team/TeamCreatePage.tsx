import React from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateTeam } from "@/features/team";
import { FormLayout } from "@/shared/components/forms/FormLayout";
import { EntityFormRenderer, type EntityFieldConfig } from "@/shared/components/forms/EntityFormRenderer";
import { Button } from "@/shared/components/ui/button";
import { useEntityForm } from "@/shared/hooks/useEntityForm";
import { queryClient } from "@/shared/api/queryClient";

const schema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  designation: z.string().min(1, "Designation is required"),
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  description: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  isLeader: z.boolean().default(false),
  addToHome: z.boolean().default(false),
  sortOrder: z.string().optional().transform((v) => (v && v.trim() !== "" ? Number(v) : undefined)),
  image: z.instanceof(File).nullable().optional(),
});

type FormValues = Readonly<{ fullname: string; designation: string; countryCode: string; phoneNumber: string; description: string; facebook: string; twitter: string; linkedin: string; instagram: string; isLeader: boolean; addToHome: boolean; sortOrder: string; image: File | null }>;
type SubmitValues = z.output<typeof schema>;

const fields: ReadonlyArray<EntityFieldConfig> = [
  { name: "fullname", label: "Full Name", type: "text" },
  { name: "designation", label: "Designation", type: "text" },
  { name: "countryCode", label: "Country Code", type: "text" },
  { name: "phoneNumber", label: "Phone Number", type: "text" },
  { name: "description", label: "Description", type: "richtext" },
  { name: "sortOrder", label: "Sort Order", type: "text" },
  { name: "facebook", label: "Facebook", type: "text" },
  { name: "twitter", label: "Twitter", type: "text" },
  { name: "linkedin", label: "LinkedIn", type: "text" },
  { name: "instagram", label: "Instagram", type: "text" },
  { name: "image", label: "Image", type: "file", accept: "image/*" },
  { name: "isLeader", label: "Leader", type: "checkbox" },
  { name: "addToHome", label: "Show on Home", type: "checkbox" },
];

export const TeamCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const createTeam = useCreateTeam();

  const form = useEntityForm<FormValues, SubmitValues>({
    schema,
    initialValues: {
      fullname: "", designation: "", countryCode: "+1", phoneNumber: "", description: "", facebook: "", twitter: "", linkedin: "", instagram: "", isLeader: false, addToHome: false, sortOrder: "", image: null,
    },
    successMessage: "Team member created",
    onSubmit: async (parsed) => {
      await createTeam.mutateAsync({ ...parsed, image: parsed.image ?? null });
      await queryClient.invalidateQueries({ queryKey: ["team", "list"] });
      const q = new URLSearchParams({ page: "1", limit: "10", search: parsed.fullname });
      navigate(`/dashboard/team?${q.toString()}`, { replace: true });
    },
  });

  const imagePreview = React.useMemo(() => (form.values.image ? URL.createObjectURL(form.values.image) : null), [form.values.image]);
  React.useEffect(() => () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }, [imagePreview]);

  return (
    <FormLayout title="Create Team Member" subtitle="Add a team member profile">
      <form onSubmit={(e) => { e.preventDefault(); void form.submit(); }} style={{ display: "grid", gap: 12 }}>
        <EntityFormRenderer fields={fields} values={form.values as Record<string, unknown>} errors={form.errors} onFieldChange={(name, value) => form.setField(name as keyof FormValues, value as never)} />
        {imagePreview ? <img src={imagePreview} alt="Preview" style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 10, border: "1px solid #eee" }} /> : null}
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="submit" disabled={form.isSubmitting}>{form.isSubmitting ? "Saving..." : "Create"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/team')}>Cancel</Button>
        </div>
      </form>
    </FormLayout>
  );
};
