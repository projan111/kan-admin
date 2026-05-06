import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { findCustomerRecord, readCustomerOrders, readCustomerWishlistProducts } from "./customerData";

const chipClassMap: Readonly<Record<string, string>> = {
  Active: "bg-[#eefaf5] text-[#0f7a58]",
  "Needs Attention": "bg-[#fff7e8] text-[#9a6700]",
  Guest: "bg-[#f5f5f7] text-[#4b5563]",
  Verified: "bg-[#edf5ff] text-[#0066cc]",
  Pending: "bg-[#fff1f1] text-[#b42318]",
};

export const CustomerDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const customer = React.useMemo(() => (id ? findCustomerRecord(id) : undefined), [id]);
  const orders = React.useMemo(() => (id ? readCustomerOrders(id) : []), [id]);
  const wishlistProducts = React.useMemo(() => (id ? readCustomerWishlistProducts(id) : []), [id]);

  if (!customer) {
    return (
      <div className="rounded-[20px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
        <h1 className="text-[24px] font-semibold text-(--text)">Customer not found</h1>
        <Button variant="ghost" className="mt-3 px-0" onClick={() => navigate("/dashboard/customers")}>
          <ArrowLeft size={15} />
          Back To Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 premium-animate-in">
      <section className="overflow-hidden rounded-[28px] border border-[#e6dccf] bg-[linear-gradient(180deg,_#fffaf3_0%,_#f5ede2_100%)] shadow-[0_28px_64px_rgba(63,33,5,0.08)]">
        <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div>
            <Button variant="ghost" className="mb-4 px-0" onClick={() => navigate("/dashboard/customers")}>
              <ArrowLeft size={15} />
              Back To Customers
            </Button>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#836d53]">Customer Relationship Profile</p>
            <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.05em] text-[#2f2418]">{customer.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f5e4d]">{customer.notes}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${chipClassMap[customer.status] ?? chipClassMap.Active}`}>
                {customer.status}
              </span>
              <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${chipClassMap[customer.verification] ?? chipClassMap.Verified}`}>
                {customer.verification}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: ShoppingBag, label: "Orders", value: String(orders.length), tone: "bg-[#fff1e8] text-[#9f4f09]" },
              { icon: Heart, label: "Wishlist", value: String(wishlistProducts.length), tone: "bg-[#fff0f4] text-[#bf2d62]" },
              { icon: Sparkles, label: "Lifetime Value", value: customer.ltv, tone: "bg-[#eef7ff] text-[#0b67b2]" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-[24px] border border-white/75 bg-white/80 p-5 backdrop-blur-sm">
                  <div className={`inline-flex rounded-full p-2.5 ${item.tone}`}>
                    <Icon size={18} />
                  </div>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a7257]">{item.label}</p>
                  <p className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-[#2f2418]">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <article className="rounded-[24px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">Customer Profile</p>
          <div className="mt-4 space-y-3">
            {[
              ["Email", customer.email],
              ["Phone", customer.phone],
              ["City", customer.city],
              ["Address", customer.address],
              ["Segment", customer.segment],
              ["Beauty Concern", customer.beautyConcern],
              ["Joined", customer.joinedAt],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 rounded-[18px] bg-[#f8f6f3] px-4 py-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-(--muted)">{label}</span>
                <span className="text-sm font-medium text-right text-(--text)">{value}</span>
              </div>
            ))}
          </div>
        </article>

        <div className="space-y-6">
          <article className="rounded-[24px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">Transaction History</p>
                <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-(--text)">Orders</h2>
              </div>
              <span className="rounded-full bg-[#f5f5f7] px-3 py-1.5 text-[11px] font-semibold text-(--muted)">{orders.length} total</span>
            </div>
            <div className="mt-5 space-y-3">
              {orders.length === 0 ? (
                <div className="rounded-[18px] bg-[#f5f5f7] p-4 text-sm text-(--muted)">No orders yet for this customer.</div>
              ) : null}
              {orders.map((order) => (
                <Link key={order.id} to={`/dashboard/orders/${order.id}`} className="block rounded-[22px] border border-(--line) bg-[linear-gradient(180deg,_#ffffff_0%,_#fafafc_100%)] p-4 transition-transform hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold tracking-[-0.02em] text-(--text)">{order.orderNumber}</p>
                      <p className="mt-1 text-sm text-(--muted)">{order.placedAt}</p>
                      <p className="mt-1 text-sm text-(--muted)">{order.paymentMethod} • {order.paymentStatus}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold text-(--text)">{order.total}</p>
                      <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${chipClassMap[order.status] ?? "bg-[#edf5ff] text-[#0066cc]"}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[24px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">Affinity List</p>
                <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-(--text)">Wishlist</h2>
              </div>
              <span className="rounded-full bg-[#f5f5f7] px-3 py-1.5 text-[11px] font-semibold text-(--muted)">{wishlistProducts.length} saved</span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {wishlistProducts.length === 0 ? (
                <div className="rounded-[18px] bg-[#f5f5f7] p-4 text-sm text-(--muted)">No wishlist items saved by this customer.</div>
              ) : null}
              {wishlistProducts.map((product) => (
                <Link key={product.id} to={`/dashboard/products/${product.id}`} className="rounded-[22px] border border-(--line) bg-[linear-gradient(180deg,_#ffffff_0%,_#fafafc_100%)] p-4 transition-transform hover:-translate-y-0.5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[16px] bg-[#f8f6f3] p-2">
                      <img src={product.coverImage} alt={product.name} className="max-h-12 w-auto object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-(--text)">{product.name}</p>
                      <p className="mt-1 text-sm text-(--muted)">{product.category} • Rs {product.salePrice}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};
