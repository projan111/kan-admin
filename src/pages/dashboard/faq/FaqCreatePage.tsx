import React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, X } from "lucide-react";
import { useCreateFaq } from "@/features/faq";
import RichTextEditor from "@/shared/components/RichTextEditor";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { queryClient } from "@/shared/api/queryClient";

type FormState = Readonly<{ title: string; description: string; sortOrder: string; isActive: boolean }>;

export const FaqCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const createFaq = useCreateFaq();
  const [form, setForm] = React.useState<FormState>({ title: "", description: "", sortOrder: "", isActive: true });
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});

  const onSubmit = async () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) nextErrors.title = "Question is required";
    if (!form.description.trim()) nextErrors.description = "Answer is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await createFaq.mutateAsync({
      title: form.title,
      description: form.description,
      isActive: form.isActive,
      sortOrder: form.sortOrder.trim() ? Number(form.sortOrder) : undefined,
    });
    await queryClient.invalidateQueries({ queryKey: ["faq", "list"] });
    navigate("/dashboard/faq", { replace: true });
  };

  return (
    <div className="p-6 w-full max-w-[960px] mx-auto">
      <div className="mb-6 flex items-center justify-between rounded-md border border-[var(--line)] bg-white px-5 py-4 shadow-[var(--card-shadow)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Add FAQ</h1>
          <p className="text-[var(--muted)]">Add a new FAQ entry</p>
        </div>
        <Button onClick={() => navigate("/dashboard/faq")} variant="outline" className="flex items-center gap-2 text-red-500">
          <X className="w-4 h-4" />
          Exit
        </Button>
      </div>
      <div className="grid gap-4 rounded-md border border-[var(--line)] bg-white p-5 shadow-[var(--card-shadow)]">
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
          <label className="mt-7 flex items-center gap-2 text-sm text-[var(--text)]">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
            Active
          </label>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => void onSubmit()} disabled={createFaq.isPending}>
            {createFaq.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create FAQ"}
          </Button>
        </div>
      </div>
    </div>
  );
};
