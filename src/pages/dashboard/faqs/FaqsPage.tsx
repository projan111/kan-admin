import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  Package,
  Globe,
  Edit,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type Faq = {
  id: string;
  question: string;
  answer: string;
  type: "Product" | "Site";
  status: "Active" | "Inactive";
  category: string;
  views: number;
  date: string;
};

// Sample data
const sampleFaqs: Faq[] = [
  {
    id: "1",
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of purchase...",
    type: "Site",
    status: "Active",
    category: "Returns",
    views: 1234,
    date: "Mar 1, 2026",
  },
  {
    id: "2",
    question: "How do I apply the foundation?",
    answer: "Start with a clean, moisturized face...",
    type: "Product",
    status: "Active",
    category: "Usage",
    views: 856,
    date: "Mar 5, 2026",
  },
  {
    id: "3",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 50 countries worldwide...",
    type: "Site",
    status: "Active",
    category: "Shipping",
    views: 642,
    date: "Feb 28, 2026",
  },
  {
    id: "4",
    question: "Is this product cruelty-free?",
    answer: "Yes, all our products are cruelty-free and vegan...",
    type: "Product",
    status: "Active",
    category: "Product Info",
    views: 423,
    date: "Mar 10, 2026",
  },
  {
    id: "5",
    question: "How long does shipping take?",
    answer: "Standard shipping takes 5-7 business days...",
    type: "Site",
    status: "Inactive",
    category: "Shipping",
    views: 312,
    date: "Feb 15, 2026",
  },
];

const statusVariantMap: Record<string, any> = {
  Active: "qualified",
  Inactive: "closedLost",
};

export const FaqsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [faqs] = React.useState<Faq[]>(sampleFaqs);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredFaqs = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return faqs;

    return faqs.filter((faq) =>
      [faq.question, faq.answer, faq.category, faq.type, faq.status].some(
        (value) => value.toLowerCase().includes(query),
      ),
    );
  }, [faqs, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = faqs.length;
    const active = faqs.filter((f) => f.status === "Active").length;
    const inactive = faqs.filter((f) => f.status === "Inactive").length;
    const productFaqs = faqs.filter((f) => f.type === "Product").length;
    const siteFaqs = faqs.filter((f) => f.type === "Site").length;

    return { total, active, inactive, productFaqs, siteFaqs };
  }, [faqs]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-zinc-900">FAQs</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage frequently asked questions for products and site
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Total FAQs
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <HelpCircle size={22} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Active
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.active}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Inactive
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.inactive}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle size={22} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-purple-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Product FAQs
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.productFaqs}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Package size={22} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-cyan-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Site FAQs
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.siteFaqs}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100">
                <Globe size={22} className="text-cyan-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {filteredFaqs.length} FAQs
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder-gray-500 outline-none transition-all focus:border-gray-400"
            />
            <button
              onClick={() => navigate("/dashboard/faqs/create")}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              + New FAQ
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 bg-white">
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      filteredFaqs.length > 0 &&
                      selectedIds.length === filteredFaqs.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? filteredFaqs.map((f) => f.id) : [],
                      )
                    }
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Type
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredFaqs.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No FAQs found.
                  </td>
                </tr>
              ) : null}
              {filteredFaqs.map((faq, idx) => (
                <tr key={faq.id} className="transition-colors hover:bg-zinc-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(faq.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, faq.id]
                            : current.filter((id) => id !== faq.id),
                        )
                      }
                      className="h-4 w-4 rounded border-zinc-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <p className="max-w-md text-sm font-medium text-zinc-900">
                      {faq.question}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {faq.category}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        faq.type === "Product"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {faq.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-zinc-900">
                    {faq.views}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={faq.status}
                      variant={statusVariantMap[faq.status]}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {faq.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/faqs/${faq.id}`)}
                        className="text-slate-400 transition-colors hover:text-zinc-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log("Delete", faq.id)}
                        className="text-slate-400 transition-colors hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-6 py-4">
            <p className="text-sm text-slate-600">
              Showing 1-5 of {filteredFaqs.length}
            </p>
            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 text-sm font-medium text-slate-600 hover:bg-zinc-50">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 text-sm font-medium text-slate-600 hover:bg-zinc-50">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
