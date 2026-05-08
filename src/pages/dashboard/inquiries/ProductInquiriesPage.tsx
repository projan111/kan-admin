import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type Inquiry = {
  id: string;
  customerName: string;
  email: string;
  productName: string;
  subject: string;
  message: string;
  status: "New" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  updatedAt: string;
};

// Sample data
const sampleInquiries: Inquiry[] = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    email: "sarah.j@email.com",
    productName: "Wireless Headphones Pro",
    subject: "Product compatibility question",
    message: "Does this work with iPhone 15?",
    status: "New",
    priority: "Medium",
    createdAt: "2026-05-08T10:30:00Z",
    updatedAt: "2026-05-08T10:30:00Z",
  },
  {
    id: "2",
    customerName: "Mike Chen",
    email: "mike.chen@email.com",
    productName: "Smart Watch Ultra",
    subject: "Shipping timeline inquiry",
    message: "When will this be back in stock?",
    status: "In Progress",
    priority: "High",
    createdAt: "2026-05-07T14:20:00Z",
    updatedAt: "2026-05-08T09:15:00Z",
  },
  {
    id: "3",
    customerName: "Emma Wilson",
    email: "emma.w@email.com",
    productName: "Laptop Stand Deluxe",
    subject: "Color options available",
    message: "Is this available in black?",
    status: "Resolved",
    priority: "Low",
    createdAt: "2026-05-06T16:45:00Z",
    updatedAt: "2026-05-07T11:30:00Z",
  },
  {
    id: "4",
    customerName: "David Brown",
    email: "david.b@email.com",
    productName: "Gaming Mouse RGB",
    subject: "Technical specifications",
    message: "What is the DPI range?",
    status: "Closed",
    priority: "Low",
    createdAt: "2026-05-05T09:10:00Z",
    updatedAt: "2026-05-06T15:20:00Z",
  },
  {
    id: "5",
    customerName: "Lisa Anderson",
    email: "lisa.a@email.com",
    productName: "Bluetooth Speaker",
    subject: "Warranty information",
    message: "What's the warranty period?",
    status: "New",
    priority: "Medium",
    createdAt: "2026-05-08T08:00:00Z",
    updatedAt: "2026-05-08T08:00:00Z",
  },
];

const statusVariantMap: Record<string, any> = {
  New: "pending",
  "In Progress": "qualified",
  Resolved: "completed",
  Closed: "closedLost",
};

const priorityColors: Record<string, string> = {
  Low: "text-slate-600 bg-zinc-100",
  Medium: "text-amber-600 bg-amber-100",
  High: "text-red-600 bg-red-100",
};

export const ProductInquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [inquiries] = React.useState<Inquiry[]>(sampleInquiries);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredInquiries = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return inquiries;

    return inquiries.filter((inquiry) =>
      [
        inquiry.customerName,
        inquiry.email,
        inquiry.productName,
        inquiry.subject,
        inquiry.status,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [inquiries, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = inquiries.length;
    const newInquiries = inquiries.filter((i) => i.status === "New").length;
    const inProgress = inquiries.filter(
      (i) => i.status === "In Progress",
    ).length;
    const resolved = inquiries.filter((i) => i.status === "Resolved").length;

    return { total, new: newInquiries, inProgress, resolved };
  }, [inquiries]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-zinc-900">
            Product Inquiries
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage product questions, support tickets, and customer inquiries
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Total Inquiries
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <MessageCircle size={22} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  New
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.new}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Clock size={22} className="text-amber-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-purple-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  In Progress
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.inProgress}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <AlertCircle size={22} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Resolved
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.resolved}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {filteredInquiries.length} inquiries
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search inquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder-gray-500 outline-none transition-all focus:border-gray-400"
            />
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
                      filteredInquiries.length > 0 &&
                      selectedIds.length === filteredInquiries.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? filteredInquiries.map((i) => i.id)
                          : [],
                      )
                    }
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Created
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No inquiries found.
                  </td>
                </tr>
              ) : null}
              {filteredInquiries.map((inquiry, idx) => (
                <tr
                  key={inquiry.id}
                  className="transition-colors hover:bg-zinc-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(inquiry.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, inquiry.id]
                            : current.filter((id) => id !== inquiry.id),
                        )
                      }
                      className="h-4 w-4 rounded border-zinc-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-zinc-900">
                        {inquiry.customerName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {inquiry.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-900">
                      {inquiry.productName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-sm text-zinc-900">
                      {inquiry.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[inquiry.priority]}`}
                    >
                      {inquiry.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={inquiry.status}
                      variant={statusVariantMap[inquiry.status]}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDate(inquiry.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/support/product-inquiries/${inquiry.id}`,
                          )
                        }
                        className="text-slate-400 transition-colors hover:text-zinc-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log("Delete", inquiry.id)}
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
              Showing 1-{Math.min(filteredInquiries.length, 10)} of{" "}
              {filteredInquiries.length}
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
