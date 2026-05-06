import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { confirmAction } from "@/shared/utils/confirm";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { missingModulesMap, type MissingModuleKey } from "./missingModulesData";
import { findMissingModuleRow, saveMissingModuleRow } from "./missingModulesStore";

const chipToneMap: Readonly<Record<string, string>> = {
  info: "bg-[#edf5ff] text-[#0066cc]",
  success: "bg-[#eefaf5] text-[#0f7a58]",
  warning: "bg-[#fff7e8] text-[#9a6700]",
  danger: "bg-[#fff1f1] text-[#b42318]",
};

const moduleAccentMap: Readonly<Record<MissingModuleKey, Readonly<{ shell: string; label: string }>>> = {
  categories: { shell: "bg-[linear-gradient(180deg,_#f8fbff_0%,_#edf4ff_100%)] border-[#dbe7f6]", label: "Catalog Structure" },
  "product-variants": { shell: "bg-[linear-gradient(180deg,_#fffaf4_0%,_#f9efe1_100%)] border-[#eadfcf]", label: "Variant Catalog" },
  "product-attributes-tags": { shell: "bg-[linear-gradient(180deg,_#fdfaff_0%,_#f4ecff_100%)] border-[#e8dcfb]", label: "Attribute Registry" },
  "product-media": { shell: "bg-[linear-gradient(180deg,_#f8fcfb_0%,_#ebf5f2_100%)] border-[#d9ebe5]", label: "Media Library" },
  advertisements: { shell: "bg-[linear-gradient(180deg,_#fff9fb_0%,_#f8ebf1_100%)] border-[#ecdbe4]", label: "Promotion Slot" },
  carts: { shell: "bg-[linear-gradient(180deg,_#fbfcfe_0%,_#edf1f7_100%)] border-[#dde4ef]", label: "Commerce Session" },
  wishlists: { shell: "bg-[linear-gradient(180deg,_#fff9fc_0%,_#f8ecf3_100%)] border-[#eddce6]", label: "Customer Intent" },
  payments: { shell: "bg-[linear-gradient(180deg,_#f8fbff_0%,_#edf3fe_100%)] border-[#d9e5fb]", label: "Payment Trace" },
  coupons: { shell: "bg-[linear-gradient(180deg,_#fffaf6_0%,_#f9f0e6_100%)] border-[#eadfce]", label: "Campaign Offer" },
  delivery: { shell: "bg-[linear-gradient(180deg,_#f7fbff_0%,_#e9f1fb_100%)] border-[#d7e3f1]", label: "Shipment View" },
  reviews: { shell: "bg-[linear-gradient(180deg,_#fffbf7_0%,_#f7efe2_100%)] border-[#e8dcc7]", label: "Moderation Queue" },
  faqs: { shell: "bg-[linear-gradient(180deg,_#f9fcff_0%,_#edf5fb_100%)] border-[#dae7f0]", label: "Support Article" },
  "product-inquiries": { shell: "bg-[linear-gradient(180deg,_#fffaf7_0%,_#f9efe5_100%)] border-[#eadfd2]", label: "Support Thread" },
  contacts: { shell: "bg-[linear-gradient(180deg,_#f8fbff_0%,_#ebf1f8_100%)] border-[#d8e0eb]", label: "Inbox Record" },
  "site-inquiries": { shell: "bg-[linear-gradient(180deg,_#f9fbff_0%,_#edf2ff_100%)] border-[#d9dff8]", label: "Site Inquiry" },
  "blog-posts": { shell: "bg-[linear-gradient(180deg,_#fffef9_0%,_#f7f2e4_100%)] border-[#ebe2cb]", label: "Content Entry" },
  "seo-metadata": { shell: "bg-[linear-gradient(180deg,_#f8fbff_0%,_#ecf4fd_100%)] border-[#dce7f2]", label: "SEO Mapping" },
  newsletter: { shell: "bg-[linear-gradient(180deg,_#fff9fb_0%,_#f7edf1_100%)] border-[#ebdce3]", label: "Audience Segment" },
  "web-push-subscriptions": { shell: "bg-[linear-gradient(180deg,_#f8fbff_0%,_#edf4fd_100%)] border-[#dce7f2]", label: "Push Registry" },
  "web-push-notifications": { shell: "bg-[linear-gradient(180deg,_#f8fbff_0%,_#ecf2ff_100%)] border-[#d8e1fb]", label: "Push Dispatch" },
  "email-campaigns": { shell: "bg-[linear-gradient(180deg,_#fffaf6_0%,_#f8efe2_100%)] border-[#ebdecc]", label: "Email Campaign" },
  "activity-logs": { shell: "bg-[linear-gradient(180deg,_#fbfcfd_0%,_#eef1f4_100%)] border-[#e0e4e8]", label: "Activity Record" },
  "audit-logs": { shell: "bg-[linear-gradient(180deg,_#fbfcff_0%,_#eef2f7_100%)] border-[#dfe5ed]", label: "Audit Trail" },
};

export const MissingModuleDetailsPage: React.FC<Readonly<{ moduleKey: MissingModuleKey }>> = ({ moduleKey }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const module = missingModulesMap[moduleKey];
  const accent = moduleAccentMap[moduleKey];
  const row = React.useMemo(() => (id ? findMissingModuleRow(moduleKey, id) : undefined), [id, moduleKey]);
  const isEditMode = searchParams.get("mode") === "edit";
  const [columnsForm, setColumnsForm] = React.useState<Readonly<Record<string, string>>>({});
  const [detailsForm, setDetailsForm] = React.useState<Readonly<Record<string, string>>>({});

  React.useEffect(() => {
    if (!row) return;

    setColumnsForm(row.columns);
    setDetailsForm(
      row.details.reduce<Readonly<Record<string, string>>>(
        (accumulator, detail) => ({
          ...accumulator,
          [detail.label]: detail.value,
        }),
        {}
      )
    );
  }, [row]);

  if (!row) {
    return (
      <div className="rounded-[20px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
        <h1 className="text-[24px] font-semibold text-(--text)">Record not found</h1>
        <Button variant="ghost" className="mt-3 px-0" onClick={() => navigate(module.routeBase)}>
          <ArrowLeft size={15} />
          Back To {module.title}
        </Button>
      </div>
    );
  }

  const onSave = async () => {
    const confirmed = await confirmAction(`Save changes to ${row.title}?`);
    if (!confirmed) return;

    saveMissingModuleRow(moduleKey, {
      ...row,
      columns: columnsForm,
      details: row.details.map((detail) => ({
        ...detail,
        value: detailsForm[detail.label] ?? detail.value,
      })),
    });

    toast.success(`${row.title} updated successfully.`);
    navigate(`${module.routeBase}/${row.id}`);
  };

  return (
    <div className="space-y-6 premium-animate-in">
      <section className={`overflow-hidden rounded-[28px] border shadow-[0_24px_56px_rgba(15,23,42,0.08)] ${accent.shell}`}>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <Button variant="ghost" className="mb-4 px-0" onClick={() => navigate(module.routeBase)}>
                <ArrowLeft size={15} />
                Back To {module.title}
              </Button>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b7280]">{accent.label}</p>
              <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.05em] text-[#1d2430]">{row.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5b6473]">{row.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!isEditMode ? (
                <Button variant="outline" size="sm" onClick={() => navigate(`${module.routeBase}/${row.id}?mode=edit`)}>
                  <Pencil size={14} />
                  Edit
                </Button>
              ) : (
                <Button size="sm" onClick={() => void onSave()}>
                  <Pencil size={14} />
                  Save Changes
                </Button>
              )}
              {row.chips?.map((chip) => (
                <span key={chip.label} className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${chipToneMap[chip.tone]}`}>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {module.columns.map((column) => (
              <div key={column.key} className="rounded-[22px] border border-white/80 bg-white/78 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">{column.label}</p>
                <p className="mt-3 text-base font-semibold tracking-[-0.02em] text-[#1d2430]">{row.columns[column.key]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[24px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">Structured Details</p>
              <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-(--text)">Record Notes</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {row.details.map((detail) => (
              <div key={detail.label} className="rounded-[18px] bg-[#f5f5f7] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-(--muted)">{detail.label}</p>
                {isEditMode ? (
                  <input
                    value={detailsForm[detail.label] ?? detail.value}
                    onChange={(event) =>
                      setDetailsForm((current) => ({
                        ...current,
                        [detail.label]: event.target.value,
                      }))
                    }
                    className="mt-3 w-full rounded-[10px] border border-(--line) bg-white px-3 py-2 text-sm text-(--text) outline-none"
                  />
                ) : (
                  <p className="mt-3 text-sm leading-7 text-(--text)">{detail.value}</p>
                )}
              </div>
            ))}
          </div>
        </article>

        <div className="space-y-6">
          <article className="rounded-[24px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">Snapshot Grid</p>
            <div className="mt-5 grid gap-3">
              {module.columns.map((column) => (
                <div key={column.key} className="flex items-center justify-between gap-4 rounded-[18px] bg-[#f8f9fb] px-4 py-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-(--muted)">{column.label}</span>
                  {isEditMode ? (
                    <input
                      value={columnsForm[column.key] ?? row.columns[column.key]}
                      onChange={(event) =>
                        setColumnsForm((current) => ({
                          ...current,
                          [column.key]: event.target.value,
                        }))
                      }
                      className="w-full max-w-[220px] rounded-[10px] border border-(--line) bg-white px-3 py-2 text-sm text-right text-(--text) outline-none"
                    />
                  ) : (
                    <span className="text-sm font-medium text-right text-(--text)">{row.columns[column.key]}</span>
                  )}
                </div>
              ))}
            </div>
          </article>

          {row.timeline && row.timeline.length > 0 ? (
            <article className="rounded-[24px] border border-(--line) bg-white p-6 shadow-[var(--card-shadow)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">Chronology</p>
              <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-(--text)">Timeline</h2>
              <div className="mt-5 space-y-4">
                {row.timeline.map((entry) => (
                  <div key={entry} className="flex gap-3 rounded-[18px] bg-[#f8f9fb] p-4">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#32314b]" />
                    <p className="text-sm leading-7 text-(--text)">{entry}</p>
                  </div>
                ))}
              </div>
            </article>
          ) : null}
        </div>
      </section>
    </div>
  );
};
