import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, X } from "lucide-react";
import { useFaqGet, useFaqList, useUpdateFaq } from "@/features/faq";
import RichTextEditor from "@/shared/components/RichTextEditor";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { slugify } from "@/shared/utils/slug";

type FormState = Readonly<{ title: string; description: string; sortOrder: string; isActive: boolean }>;

export const FaqEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const find = useFaqList({ page: 1, limit: 50, search: slug }, Boolean(slug));
  const resolvedId = React.useMemo(() => {
    if (!slug) return undefined;
    const rows = find.data?.data ?? [];
    const exact = rows.find((r) => slugify(r.title ?? "") === slug);
    return exact?.id ?? rows[0]?.id;
  }, [find.data?.data, slug]);
  const faqQuery = useFaqGet(resolvedId);
  const updateFaq = useUpdateFaq();
  const [form, setForm] = React.useState<FormState>({ title: "", description: "", sortOrder: "", isActive: true });
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});

  React.useEffect(() => {
    if (!faqQuery.data) return;
    setForm({
      title: faqQuery.data.title ?? "",
      description: typeof faqQuery.data.description === "string" ? faqQuery.data.description : "",
      sortOrder: faqQuery.data.sortOrder != null ? String(faqQuery.data.sortOrder) : "",
      isActive: Boolean(faqQuery.data.isActive),
    });
  }, [faqQuery.data]);

  const onSubmit = async () => {
    if (!resolvedId) return;
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) nextErrors.title = "Question is required";
    if (!form.description.trim()) nextErrors.description = "Answer is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await updateFaq.mutateAsync({
      id: resolvedId,
      dto: {
        title: form.title,
        description: form.description,
        isActive: form.isActive,
        sortOrder: form.sortOrder.trim() ? Number(form.sortOrder) : undefined,
      },
    });
    navigate("/dashboard/faq", { replace: true });
  };

  if (!slug) return <div>Invalid FAQ slug.</div>;
  if (find.isLoading) return <div>Loading FAQ...</div>;
  if (!resolvedId) return <div>FAQ not found.</div>;
  if (faqQuery.isLoading) return <div>Loading FAQ...</div>;
  if (faqQuery.isError) return <div style={{ color: "crimson" }}>Failed to load FAQ.</div>;

  return (
    <div className="p-6 w-full max-w-[960px] mx-auto">
      <div className="flex justify-between items-center mb-6 bg-white px-1 py-1">
        <div>
          <h1 className="text-2xl font-bold">Edit FAQ</h1>
          <p className="text-muted-foreground">Update FAQ details</p>
        </div>
        <Button onClick={() => navigate("/dashboard/faq")} variant="outline" className="text-red-500 flex items-center gap-2">
          <X className="w-4 h-4" />
          Exit
        </Button>
      </div>
      <div className="grid gap-4 py-4 border border-slate-200 rounded-xs bg-white p-4">
        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm font-medium">Question</label>
          <Input id="title" type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Enter question" />
          {errors.title ? <p className="text-sm text-red-500">{errors.title}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm font-medium">Answer</label>
          <RichTextEditor initialContent={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} placeholder="Enter answer" />
          {errors.description ? <p className="text-sm text-red-500">{errors.description}</p> : null}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="grid gap-2">
            <label htmlFor="sortOrder" className="text-sm font-medium">Sort Order</label>
            <Input id="sortOrder" type="number" value={form.sortOrder} onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))} />
          </div>
          <label className="flex items-center gap-2 mt-7 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
            Active
          </label>
        </div>
        <Button onClick={() => void onSubmit()} disabled={updateFaq.isPending} className="w-full">
          {updateFaq.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</> : "Update FAQ"}
        </Button>
      </div>
    </div>
  );
};
