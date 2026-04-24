import React from "react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamGet, useTeamList, useUpdateTeam } from "@/features/team";
import { FormLayout } from "@/shared/components/forms/FormLayout";
import { EntityFormRenderer, type EntityFieldConfig } from "@/shared/components/forms/EntityFormRenderer";
import { Button } from "@/shared/components/ui/button";
import { useEntityForm } from "@/shared/hooks/useEntityForm";
import { slugify } from "@/shared/utils/slug";

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

export const TeamEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const find = useTeamList({ page: 1, limit: 200, search: slug }, Boolean(slug));
  const id = React.useMemo(() => {
    if (!slug) return undefined;
    const rows = find.data?.data ?? [];
    return rows.find((r) => slugify(r.fullname ?? "") === slug)?.id ?? rows[0]?.id;
  }, [find.data?.data, slug]);
  const teamQuery = useTeamGet(id);
  const updateTeam = useUpdateTeam();
  const [hideExistingImage, setHideExistingImage] = React.useState(false);

  const form = useEntityForm<FormValues, SubmitValues>({
    schema,
    initialValues: { fullname: "", designation: "", countryCode: "+1", phoneNumber: "", description: "", facebook: "", twitter: "", linkedin: "", instagram: "", isLeader: false, addToHome: false, sortOrder: "", image: null },
    successMessage: "Team member updated",
    onSubmit: async (parsed) => {
      if (!id) return;
      await updateTeam.mutateAsync({ id, dto: { ...parsed, image: parsed.image ?? null } });
      navigate("/dashboard/team", { replace: true });
    },
  });
  const resetForm = form.reset;

  React.useEffect(() => {
    if (!teamQuery.data) return;
    resetForm({
      fullname: teamQuery.data.fullname ?? "", designation: teamQuery.data.designation ?? "", countryCode: teamQuery.data.countryCode ?? "+1", phoneNumber: teamQuery.data.phoneNumber ?? "", description: typeof teamQuery.data.description === "string" ? teamQuery.data.description : "", facebook: teamQuery.data.facebook ?? "", twitter: teamQuery.data.twitter ?? "", linkedin: teamQuery.data.linkedin ?? "", instagram: teamQuery.data.instagram ?? "", isLeader: Boolean(teamQuery.data.isLeader), addToHome: Boolean(teamQuery.data.addToHome), sortOrder: teamQuery.data.sortOrder != null ? String(teamQuery.data.sortOrder) : "", image: null,
    });
    setHideExistingImage(false);
  }, [teamQuery.data, resetForm]);

  if (!slug) return <div>Invalid team member slug.</div>;
  if (find.isLoading) return <div>Loading team member...</div>;
  if (!id) return <div>Team member not found.</div>;
  if (teamQuery.isLoading) return <div>Loading team member...</div>;
  if (teamQuery.isError) return <div style={{ color: "crimson" }}>Failed to load team member.</div>;

  return (
    <FormLayout
      title="Edit Team Member"
      subtitle="Update team member profile"
    >
      <form onSubmit={(e) => { e.preventDefault(); void form.submit(); }} style={{ display: "grid", gap: 12 }}>
        <EntityFormRenderer
          fields={fields}
          values={form.values as Record<string, unknown>}
          errors={form.errors}
          onFieldChange={(name, value) => form.setField(name as keyof FormValues, value as never)}
          onRemoveExistingPreview={(name) => {
            if (name !== "image") return;
            form.setField("image", null);
            setHideExistingImage(true);
          }}
          filePreviewUrls={{
            image: hideExistingImage
              ? null
              : (teamQuery.data as { imageUrl?: string; image?: string } | undefined)?.imageUrl ??
                (teamQuery.data as { imageUrl?: string; image?: string } | undefined)?.image ??
                null,
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="submit" disabled={form.isSubmitting}>{form.isSubmitting ? "Saving..." : "Update"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/team')}>Cancel</Button>
        </div>
      </form>
    </FormLayout>
  );
};
