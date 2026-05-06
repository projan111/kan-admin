import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { confirmAction } from "@/shared/utils/confirm";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { findProductRecord } from "./productData";
import { isCreatedProductId, saveCreatedProduct, saveProductDraft, type CosmeticProductDraft } from "./productDraftStore";

type FormState = Omit<CosmeticProductDraft, "id" | "createdAt">;

const initialForm: FormState = {
  name: "",
  slug: "",
  sku: "",
  category: "Face",
  subcategory: "",
  brand: "KAN Cosmetics",
  size: "",
  finish: "Natural",
  skinType: "All Skin Types",
  shadeName: "",
  shadeFamily: "",
  mrp: "",
  salePrice: "",
  stock: "",
  lowStockThreshold: "",
  shortDescription: "",
  description: "",
  coverImage: "/KAN WEBSITE/KAN PRODUCTS/IMG_1296.PNG",
  hoverImage: "/KAN WEBSITE/KAN PRODUCTS/liquid lipstick.png",
  ingredients: "",
  usageDirections: "",
  publishStatus: "Draft",
  crueltyFree: true,
  vegan: false,
  fragranceFree: false,
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const fieldClassName =
  "w-full rounded-[12px] border border-[var(--line)] bg-white px-3 py-3 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15";

const SectionCard = ({
  title,
  eyebrow,
  children,
}: Readonly<{ title: string; eyebrow: string; children: React.ReactNode }>) => (
  <section className="rounded-[24px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">{eyebrow}</p>
    <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-(--text)">{title}</h2>
    <div className="mt-5">{children}</div>
  </section>
);

export const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [form, setForm] = React.useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const existingProduct = React.useMemo(() => (id ? findProductRecord(id) : undefined), [id]);
  const isEditMode = Boolean(id);

  React.useEffect(() => {
    if (!existingProduct) return;

    const { id: _id, createdAt: _createdAt, ...editableFields } = existingProduct;
    setForm(editableFields);
  }, [existingProduct]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !current.slug.trim()) {
        next.slug = toSlug(String(value));
      }
      return next;
    });
  };

  const requiredFields = [
    form.name,
    form.slug,
    form.sku,
    form.category,
    form.mrp,
    form.salePrice,
    form.stock,
    form.shortDescription,
    form.description,
  ];

  const isFormValid = requiredFields.every((value) => value.trim());

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid || isSubmitting) return;

    const confirmed = await confirmAction(
      isEditMode
        ? `Save changes to ${form.name || "this cosmetic product"}?`
        : "Add this cosmetic product to the catalog?"
    );
    if (!confirmed) return;

    setIsSubmitting(true);

    const nextProduct: CosmeticProductDraft = {
      ...form,
      id: existingProduct?.id ?? `PRD-${Date.now()}`,
      createdAt: existingProduct?.createdAt ?? new Date().toISOString(),
    };

    if (isEditMode) {
      saveProductDraft(nextProduct, Boolean(existingProduct && isCreatedProductId(existingProduct.id)));
      toast.success(`${form.name} was updated successfully.`);
    } else {
      saveCreatedProduct(nextProduct);
      toast.success(`${form.name} was added successfully.`);
    }

    setIsSubmitting(false);
    navigate("/dashboard/products");
  };

  if (isEditMode && !existingProduct) {
    return (
      <div className="rounded-[20px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
        <h1 className="text-[24px] font-semibold text-(--text)">Product not found</h1>
        <Button variant="ghost" className="mt-3 px-0" onClick={() => navigate("/dashboard/products")}>
          <ArrowLeft size={15} />
          Back To Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 premium-animate-in">
      <section className="overflow-hidden rounded-[28px] border border-[#1d1d1f]/8 bg-[linear-gradient(180deg,_#fcfcfd_0%,_#f0f0f2_100%)] shadow-[0_24px_64px_rgba(29,29,31,0.08)]">
        <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Button variant="ghost" className="mb-4 px-0" onClick={() => navigate("/dashboard/products")}>
              <ArrowLeft size={15} />
              Back To Products
            </Button>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#66686d]">
              {isEditMode ? "Catalog Revision" : "Catalog Creation"}
            </p>
            <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.05em] text-[#1d1d1f]">
              {isEditMode ? "Edit Cosmetic Product" : "Add Cosmetic Product"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f6167]">
              {isEditMode
                ? "Refine pricing, media, claims, and descriptive content from a structured cosmetics-focused form."
                : "Create a professional KAN catalog record with publish-ready merchandising, cosmetic attributes, and operational details."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Category", form.category || "Not set"],
              ["Status", form.publishStatus || "Draft"],
              ["Sale Price", form.salePrice ? `Rs ${form.salePrice}` : "Not set"],
              ["Stock", form.stock || "Not set"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[22px] border border-white/80 bg-white/88 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6a6c71]">{label}</p>
                <p className="mt-3 text-[22px] font-semibold tracking-[-0.04em] text-[#1d1d1f]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <form className="space-y-6" onSubmit={onSubmit}>
        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <SectionCard title="Core Identity" eyebrow="Product Basics">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Product Name</label>
                  <Input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="KAN Velvet Matte Lipstick" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Slug</label>
                  <Input value={form.slug} onChange={(event) => updateField("slug", toSlug(event.target.value))} placeholder="kan-velvet-matte-lipstick" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">SKU</label>
                  <Input value={form.sku} onChange={(event) => updateField("sku", event.target.value)} placeholder="KAN-LIP-001" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Brand</label>
                  <Input value={form.brand} onChange={(event) => updateField("brand", event.target.value)} placeholder="KAN Cosmetics" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Category</label>
                  <select value={form.category} onChange={(event) => updateField("category", event.target.value)} className={fieldClassName}>
                    <option>Face</option>
                    <option>Lips</option>
                    <option>Eyes</option>
                    <option>Skincare</option>
                    <option>Tools</option>
                    <option>Hair</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Subcategory</label>
                  <Input value={form.subcategory} onChange={(event) => updateField("subcategory", event.target.value)} placeholder="Lipstick / Primer / Compact Powder" />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Commercial Setup" eyebrow="Pricing And Stock">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">MRP</label>
                  <Input value={form.mrp} onChange={(event) => updateField("mrp", event.target.value)} placeholder="1800" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Sale Price</label>
                  <Input value={form.salePrice} onChange={(event) => updateField("salePrice", event.target.value)} placeholder="1499" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Stock</label>
                  <Input value={form.stock} onChange={(event) => updateField("stock", event.target.value)} placeholder="120" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Low Stock Threshold</label>
                  <Input value={form.lowStockThreshold} onChange={(event) => updateField("lowStockThreshold", event.target.value)} placeholder="15" />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Beauty Attributes" eyebrow="Cosmetic Profile">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Size</label>
                  <Input value={form.size} onChange={(event) => updateField("size", event.target.value)} placeholder="30 ml / 8 g / 1 unit" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Finish</label>
                  <select value={form.finish} onChange={(event) => updateField("finish", event.target.value)} className={fieldClassName}>
                    <option>Natural</option>
                    <option>Matte</option>
                    <option>Dewy</option>
                    <option>Glossy</option>
                    <option>Satin</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Skin Type</label>
                  <select value={form.skinType} onChange={(event) => updateField("skinType", event.target.value)} className={fieldClassName}>
                    <option>All Skin Types</option>
                    <option>Dry</option>
                    <option>Oily</option>
                    <option>Combination</option>
                    <option>Sensitive</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Shade Name</label>
                  <Input value={form.shadeName} onChange={(event) => updateField("shadeName", event.target.value)} placeholder="Rose Nude" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Shade Family</label>
                  <Input value={form.shadeFamily} onChange={(event) => updateField("shadeFamily", event.target.value)} placeholder="Warm Nude" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Publish Status</label>
                  <select value={form.publishStatus} onChange={(event) => updateField("publishStatus", event.target.value)} className={fieldClassName}>
                    <option>Draft</option>
                    <option>Active</option>
                    <option>Archived</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm text-(--text)">
                  <Checkbox checked={form.crueltyFree} onCheckedChange={(checked) => updateField("crueltyFree", checked === true)} />
                  Cruelty Free
                </label>
                <label className="flex items-center gap-2 text-sm text-(--text)">
                  <Checkbox checked={form.vegan} onCheckedChange={(checked) => updateField("vegan", checked === true)} />
                  Vegan
                </label>
                <label className="flex items-center gap-2 text-sm text-(--text)">
                  <Checkbox checked={form.fragranceFree} onCheckedChange={(checked) => updateField("fragranceFree", checked === true)} />
                  Fragrance Free
                </label>
              </div>
            </SectionCard>

            <SectionCard title="Merchandising Copy" eyebrow="Descriptions">
              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Short Description</label>
                  <textarea
                    value={form.shortDescription}
                    onChange={(event) => updateField("shortDescription", event.target.value)}
                    placeholder="Short product hook for product cards and quick summaries"
                    rows={3}
                    className={fieldClassName}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Full Description</label>
                  <textarea
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="Explain benefits, texture, finish, application, and ideal customer use case"
                    rows={5}
                    className={fieldClassName}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Ingredients</label>
                    <textarea
                      value={form.ingredients}
                      onChange={(event) => updateField("ingredients", event.target.value)}
                      placeholder="List primary ingredients or INCI summary"
                      rows={5}
                      className={fieldClassName}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Usage Directions</label>
                    <textarea
                      value={form.usageDirections}
                      onChange={(event) => updateField("usageDirections", event.target.value)}
                      placeholder="How to apply, layer, and remove the product"
                      rows={5}
                      className={fieldClassName}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="Media Preview" eyebrow="Visual Assets">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Cover Image URL</label>
                  <Input value={form.coverImage} onChange={(event) => updateField("coverImage", event.target.value)} placeholder="/KAN WEBSITE/KAN PRODUCTS/liquid lipstick.png" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Hover Image URL</label>
                  <Input value={form.hoverImage} onChange={(event) => updateField("hoverImage", event.target.value)} placeholder="/KAN WEBSITE/KAN PRODUCTS/compact powder.jpg" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[20px] bg-[#f6f7f8] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Cover Preview</p>
                    <div className="mt-4 flex h-44 items-center justify-center rounded-[18px] bg-white p-4 shadow-[0_14px_24px_rgba(15,23,42,0.06)]">
                      <img src={form.coverImage} alt="Cover preview" className="max-h-32 w-auto object-contain" />
                    </div>
                  </div>
                  <div className="rounded-[20px] bg-[#f6f7f8] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Hover Preview</p>
                    <div className="mt-4 flex h-44 items-center justify-center rounded-[18px] bg-white p-4 shadow-[0_14px_24px_rgba(15,23,42,0.06)]">
                      <img src={form.hoverImage} alt="Hover preview" className="max-h-32 w-auto object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <section className="sticky top-6 rounded-[24px] border border-[#d9e5f1] bg-[linear-gradient(180deg,_#f9fbff_0%,_#edf4fb_100%)] p-6 shadow-[0_24px_52px_rgba(61,93,135,0.10)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6c7b92]">Preview Summary</p>
              <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-[#1d2430]">{form.name || "Product name will appear here"}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5f6f88]">{form.shortDescription || "The quick merchandising summary will appear here as you fill the form."}</p>

              <div className="mt-5 grid gap-3">
                {[
                  ["Category", `${form.category}${form.subcategory ? ` • ${form.subcategory}` : ""}`],
                  ["SKU", form.sku || "Not set"],
                  ["Price", form.salePrice ? `Rs ${form.salePrice}` : "Not set"],
                  ["Status", form.publishStatus || "Draft"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 rounded-[18px] border border-[#dde7f2] bg-white/90 px-4 py-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#71819b]">{label}</span>
                    <span className="text-sm font-medium text-right text-[#1d2430]">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {form.crueltyFree ? <span className="rounded-full border border-[#d7e3f3] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#315d8f]">Cruelty Free</span> : null}
                {form.vegan ? <span className="rounded-full border border-[#d7e3f3] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#315d8f]">Vegan</span> : null}
                {form.fragranceFree ? <span className="rounded-full border border-[#d7e3f3] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#315d8f]">Fragrance Free</span> : null}
              </div>
            </section>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard/products")}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isFormValid || isSubmitting}>
            {isEditMode ? <Pencil size={15} /> : <Plus size={15} />}
            {isSubmitting ? (isEditMode ? "Saving..." : "Adding...") : isEditMode ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};
