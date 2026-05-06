import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PackageCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { confirmAction } from "@/shared/utils/confirm";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { readOrderRecords } from "./orderData";
import { orderStatuses, saveStoredOrderStatus, type OrderStatus } from "./orderStore";

const statusClassMap: Readonly<Record<string, string>> = {
  Pending: "bg-[#fff7e8] text-[#9a6700]",
  Confirmed: "bg-[#edf5ff] text-[#0066cc]",
  Packed: "bg-[#edf5ff] text-[#1d4ed8]",
  Shipped: "bg-[#eef2ff] text-[#4338ca]",
  Delivered: "bg-[#eefaf5] text-[#0f7a58]",
  Cancelled: "bg-[#fff1f1] text-[#b42318]",
  Returned: "bg-[#fff1f1] text-[#b42318]",
};

const fieldClassName =
  "w-full rounded-[12px] border border-[var(--line)] bg-white px-3 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15";

export const OrderDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const order = React.useMemo(() => readOrderRecords().find((item) => item.id === id), [id]);
  const [status, setStatus] = React.useState<OrderStatus>(order?.status ?? "Pending");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  if (!order) {
    return (
      <div className="rounded-[20px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
        <h1 className="text-[24px] font-semibold text-(--text)">Order not found</h1>
        <Button variant="ghost" className="mt-3 px-0" onClick={() => navigate("/dashboard/orders")}>
          <ArrowLeft size={15} />
          Back To Orders
        </Button>
      </div>
    );
  }

  const onSaveStatus = async () => {
    if (status === order.status || isSaving) return;

    const confirmed = await confirmAction(`Change order ${order.orderNumber} status to ${status}?`);
    if (!confirmed) return;

    setIsSaving(true);
    saveStoredOrderStatus(order.id, status);
    toast.success(`Order ${order.orderNumber} updated to ${status}.`);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 premium-animate-in">
      <section className="overflow-hidden rounded-[28px] border border-[#d8dee8] bg-[linear-gradient(180deg,_#fbfcfe_0%,_#eef3f9_100%)] shadow-[0_24px_60px_rgba(17,24,39,0.08)]">
        <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Button variant="ghost" className="mb-4 px-0" onClick={() => navigate("/dashboard/orders")}>
              <ArrowLeft size={15} />
              Back To Orders
            </Button>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5b6473]">Order Command View</p>
            <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.05em] text-[#1d2430]">{order.orderNumber}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#596273]">
              Review customer, payment, fulfillment, and line-item details from one operational surface.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Placed", order.placedAt],
                ["Payment", `${order.paymentMethod} / ${order.paymentStatus}`],
                ["City", order.city],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[20px] border border-white/80 bg-white/85 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6a7280]">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-[#1d2430]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#d5dbe5] bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6a7280]">Fulfillment Status</p>
                <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.04em] text-[#1d2430]">Update Order State</h2>
              </div>
              <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusClassMap[order.status] ?? statusClassMap.Pending}`}>
                {order.status}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6a7280]">Order Status</label>
                <select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)} className={fieldClassName}>
                  {orderStatuses.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <Button className="w-full" onClick={onSaveStatus} disabled={status === order.status || isSaving}>
                <PackageCheck size={15} />
                {isSaving ? "Saving..." : "Update Status"}
              </Button>
            </div>

            <div className="mt-5 space-y-3">
              {[
                `Order placed on ${order.placedAt}`,
                `${order.paymentMethod} payment status: ${order.paymentStatus}`,
                `Current dashboard status: ${order.status}`,
              ].map((entry) => (
                <div key={entry} className="flex gap-3 rounded-[16px] bg-[#f5f8fc] px-4 py-3">
                  <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-[#1d2430]" />
                  <p className="text-sm text-[#364152]">{entry}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <article className="rounded-[24px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">Order Parties</p>
          <div className="mt-4 space-y-4">
            <div className="rounded-[20px] bg-[#f5f7fa] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Customer</p>
              <p className="mt-2 text-base font-semibold text-(--text)">{order.customerName}</p>
              <p className="mt-1 text-sm text-(--muted)">{order.customerEmail}</p>
              <p className="mt-1 text-sm text-(--muted)">{order.phone}</p>
            </div>
            <div className="rounded-[20px] bg-[#f5f7fa] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Shipping Address</p>
              <p className="mt-2 text-sm leading-7 text-(--text)">{order.shippingAddress}</p>
              <p className="mt-2 text-sm text-(--muted)">Customer note: {order.notes}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[24px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">Commercial Breakdown</p>
              <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-(--text)">Line Items</h2>
            </div>
            <div className="rounded-[18px] border border-[#d9e5f1] bg-[#f3f7fc] px-4 py-2 text-right text-[#1d2430]">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#6f7e96]">Order Total</p>
              <p className="mt-1 text-lg font-semibold">{order.total}</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {order.items.map((item) => (
              <article key={`${item.sku}-${item.name}`} className="grid gap-4 rounded-[22px] border border-(--line) bg-[linear-gradient(180deg,_#ffffff_0%,_#fafafc_100%)] p-4 md:grid-cols-[92px_1fr_auto] md:items-center">
                <div className="flex h-[92px] w-[92px] items-center justify-center rounded-[18px] bg-[#f3f4f6] p-3">
                  <img src={item.image} alt={item.name} className="max-h-[68px] w-auto object-contain" />
                </div>
                <div>
                  <p className="text-base font-semibold tracking-[-0.02em] text-(--text)">{item.name}</p>
                  <p className="mt-1 text-sm text-(--muted)">SKU: {item.sku}</p>
                  <p className="mt-1 text-sm text-(--muted)">Qty: {item.quantity}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted)">Unit Price</p>
                  <p className="mt-2 text-lg font-semibold text-(--text)">{item.unitPrice}</p>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};
