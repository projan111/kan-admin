import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { findProductRecord } from "./productData";

const chipClass = "rounded-full border border-[#d7e3f3] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#315d8f]";

const detailRows = (product: NonNullable<ReturnType<typeof findProductRecord>>) => [
  ["SKU", product.sku],
  ["Slug", product.slug],
  ["Brand", product.brand],
  ["Category", product.category],
  ["Subcategory", product.subcategory || "Not set"],
  ["Size", product.size || "Not set"],
  ["Finish", product.finish || "Not set"],
  ["Skin Type", product.skinType || "Not set"],
  ["Shade Name", product.shadeName || "Not set"],
  ["Shade Family", product.shadeFamily || "Not set"],
] as const;

export const ProductDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = React.useMemo(() => (id ? findProductRecord(id) : undefined), [id]);

  if (!product) {
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
      <section className="overflow-hidden rounded-[28px] border border-[#d9e5f1] bg-[linear-gradient(180deg,_#f9fbff_0%,_#eef4fb_100%)] shadow-[0_28px_80px_rgba(42,73,120,0.10)]">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_transparent_30%),linear-gradient(135deg,_#f8fbff_0%,_#eef4fb_55%,_#e7eef8_100%)] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <Button variant="ghost" className="mb-4 border border-[#d7e2ef] bg-white px-3 text-[#1d2430] hover:bg-[#f5f8fc]" onClick={() => navigate("/dashboard/products")}>
                <ArrowLeft size={15} />
                Back To Products
              </Button>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#68778f]">Cosmetic Product Record</p>
              <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.05em] text-[#1d2430] sm:text-[42px]">{product.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f6f88]">{product.shortDescription}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className={chipClass}>{product.publishStatus}</span>
                {product.crueltyFree ? <span className={chipClass}>Cruelty Free</span> : null}
                {product.vegan ? <span className={chipClass}>Vegan</span> : null}
                {product.fragranceFree ? <span className={chipClass}>Fragrance Free</span> : null}
              </div>
            </div>

            <div className="min-w-[220px] rounded-[24px] border border-[#d9e5f1] bg-white/92 p-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Sale Price", `Rs ${product.salePrice}`],
                  ["MRP", `Rs ${product.mrp}`],
                  ["Stock", product.stock],
                  ["Threshold", product.lowStockThreshold || "Not set"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[18px] border border-[#e2eaf4] bg-[#f7faff] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a8698]">{label}</p>
                    <p className="mt-2 text-[18px] font-semibold tracking-[-0.03em] text-[#1d2430]">{value}</p>
                  </div>
                ))}
              </div>
              <Button className="mt-4 w-full" onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}>
                <Pencil size={15} />
                Edit Product
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[26px] border border-[#d9e5f1] bg-white/80 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[22px] border border-[#dde8f4] bg-[linear-gradient(180deg,_#ffffff_0%,_#f4f8fd_100%)] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a8698]">Cover Image</p>
                  <div className="mt-4 flex h-[300px] items-center justify-center rounded-[18px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_46%),#f7f7f8] p-5">
                    <img src={product.coverImage} alt={product.name} className="max-h-[240px] w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.14)]" />
                  </div>
                </div>
                <div className="rounded-[22px] border border-[#dde8f4] bg-[linear-gradient(180deg,_#ffffff_0%,_#f4f8fd_100%)] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a8698]">Hover Image</p>
                  <div className="mt-4 flex h-[300px] items-center justify-center rounded-[18px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_46%),#f7f7f8] p-5">
                    <img src={product.hoverImage} alt={`${product.name} hover`} className="max-h-[240px] w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.14)]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {detailRows(product).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-[20px] border border-[#dde7f2] bg-white/88 px-4 py-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a8698]">{label}</span>
                  <span className="text-sm font-medium text-right text-[#1d2430]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[24px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">Editorial Description</p>
          <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.04em] text-(--text)">Product Narrative</h2>
          <p className="mt-4 text-sm leading-8 text-(--text)">{product.description}</p>
        </article>

        <article className="rounded-[24px] border border-(--line) bg-[linear-gradient(180deg,_#ffffff_0%,_#f7f7f8_100%)] p-6 shadow-[var(--card-shadow)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">Formula Notes</p>
          <div className="mt-4 grid gap-4">
            <div className="rounded-[20px] border border-(--line) bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Ingredients</p>
              <p className="mt-3 text-sm leading-7 text-(--text)">{product.ingredients || "No ingredients provided."}</p>
            </div>
            <div className="rounded-[20px] border border-(--line) bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Usage Directions</p>
              <p className="mt-3 text-sm leading-7 text-(--text)">{product.usageDirections || "No usage directions provided."}</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};
