import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Boxes } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { confirmAction } from "@/shared/utils/confirm";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { appendInventoryMovement, saveInventoryAdjustment } from "./inventoryStore";
import { findInventoryRecord } from "./inventoryData";

const statusClassMap: Readonly<Record<string, string>> = {
  "In Stock": "bg-[#eefaf5] text-[#0f7a58]",
  "Low Stock": "bg-[#fff7e8] text-[#9a6700]",
  Reserved: "bg-[#edf5ff] text-[#0066cc]",
  "Out Of Stock": "bg-[#fff1f1] text-[#b42318]",
};

const fieldClassName =
  "w-full rounded-[12px] border border-[var(--line)] bg-white px-3 py-3 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15";

export const InventoryDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [quantityDelta, setQuantityDelta] = React.useState("0");
  const [reason, setReason] = React.useState("");
  const [refreshKey, setRefreshKey] = React.useState(0);
  const inventory = React.useMemo(() => (id ? findInventoryRecord(id) : undefined), [id, refreshKey]);

  if (!inventory) {
    return (
      <div className="rounded-[20px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
        <h1 className="text-[24px] font-semibold text-(--text)">Inventory item not found</h1>
        <Button variant="ghost" className="mt-3 px-0" onClick={() => navigate("/dashboard/inventory")}>
          <ArrowLeft size={15} />
          Back To Inventory
        </Button>
      </div>
    );
  }

  const onAdjustStock = async () => {
    const parsedDelta = Number(quantityDelta);
    if (!Number.isFinite(parsedDelta) || parsedDelta === 0 || !reason.trim()) return;

    const confirmed = await confirmAction(`Apply ${parsedDelta > 0 ? "+" : ""}${parsedDelta} stock adjustment to ${inventory.productName} ${inventory.variant}?`);
    if (!confirmed) return;

    saveInventoryAdjustment(inventory.id, parsedDelta);
    appendInventoryMovement({
      id: `MVT-${Date.now()}`,
      inventoryId: inventory.id,
      type: "manual_adjustment",
      quantityDelta: parsedDelta,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    });

    toast.success(`Inventory updated for ${inventory.productName} ${inventory.variant}.`);
    setQuantityDelta("0");
    setReason("");
    setRefreshKey((current) => current + 1);
  };

  return (
    <div className="space-y-6 premium-animate-in">
      <section className="overflow-hidden rounded-[28px] border border-[#dae3ef] bg-[linear-gradient(180deg,_#f8fbff_0%,_#ebf2fb_100%)] shadow-[0_28px_64px_rgba(30,64,175,0.08)]">
        <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[1fr_1fr]">
          <div>
            <Button variant="ghost" className="mb-4 px-0" onClick={() => navigate("/dashboard/inventory")}>
              <ArrowLeft size={15} />
              Back To Inventory
            </Button>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5d6f8d]">Stock Control Record</p>
            <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.05em] text-[#1f2a3d]">{inventory.productName}</h1>
            <p className="mt-3 text-sm leading-7 text-[#5f6f88]">{inventory.variant} • {inventory.sku} • {inventory.branch}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusClassMap[inventory.status] ?? statusClassMap["In Stock"]}`}>
                {inventory.status}
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#39537f] shadow-[0_10px_20px_rgba(59,130,246,0.08)]">
                {inventory.category}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["On Hand", String(inventory.onHand)],
              ["Available", String(inventory.available)],
              ["Reserved", String(inventory.reserved)],
              ["Incoming", String(inventory.incoming)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[22px] border border-white/80 bg-white/82 p-5 shadow-[0_18px_34px_rgba(59,130,246,0.08)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6980a5]">{label}</p>
                <p className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-[#1f2a3d]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
        <div className="space-y-6">
          <article className="rounded-[24px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">Variant Context</p>
            <div className="mt-4 flex items-center gap-4 rounded-[22px] bg-[#f4f7fb] p-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[18px] bg-white p-3 shadow-[0_14px_24px_rgba(15,23,42,0.06)]">
                <img src={inventory.coverImage} alt={inventory.productName} className="max-h-14 w-auto object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-(--text)">{inventory.productName}</p>
                <p className="mt-1 text-sm text-(--muted)">{inventory.variant} • {inventory.category}</p>
                <p className="mt-1 text-sm text-(--muted)">Branch: {inventory.branch}</p>
              </div>
            </div>
            <Link to={`/dashboard/products/${inventory.productId}`} className="mt-4 inline-flex text-sm font-semibold text-[#0066cc]">
              View Product
            </Link>
          </article>

          <article className="rounded-[24px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">Adjustment Panel</p>
            <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-(--text)">Manual Stock Update</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Quantity Delta</label>
                <Input value={quantityDelta} onChange={(event) => setQuantityDelta(event.target.value)} placeholder="Use positive to add, negative to deduct" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Reason</label>
                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Example: cycle count correction, damaged units removed, new stock received"
                  rows={4}
                  className={fieldClassName}
                />
              </div>
              <Button className="w-full" onClick={onAdjustStock}>
                <Boxes size={15} />
                Apply Adjustment
              </Button>
            </div>
          </article>
        </div>

        <article className="rounded-[24px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">Operations Timeline</p>
              <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-(--text)">Movement History</h2>
            </div>
            <span className="rounded-full bg-[#eef4fb] px-3 py-1.5 text-[11px] font-semibold text-[#526b92]">
              {inventory.movements.length} entries
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {inventory.movements.map((movement) => (
              <div key={movement.id} className="grid gap-4 rounded-[22px] border border-(--line) bg-[linear-gradient(180deg,_#ffffff_0%,_#f7f9fc_100%)] p-4 md:grid-cols-[auto_1fr_auto] md:items-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dfeaf7] text-[#315d8f]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#315d8f]" />
                </div>
                <div>
                  <p className="text-sm font-semibold capitalize text-(--text)">{movement.type.replace(/_/g, " ")}</p>
                  <p className="mt-1 text-sm leading-7 text-(--muted)">{movement.reason}</p>
                  <p className="mt-2 text-[12px] text-(--muted)">{new Date(movement.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Delta</p>
                  <p className="mt-2 text-lg font-semibold text-(--text)">
                    {movement.quantityDelta > 0 ? "+" : ""}
                    {movement.quantityDelta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};
