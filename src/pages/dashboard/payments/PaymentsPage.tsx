import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Edit,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type Payment = {
  id: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  amount: string;
  method: string;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  date: string;
};

// Sample data
const samplePayments: Payment[] = [
  {
    id: "1",
    transactionId: "TXN-2026-001",
    customerName: "Alice Martin",
    customerEmail: "alice@acme.com",
    orderNumber: "ORD-1001",
    amount: "$125.00",
    method: "Credit Card",
    status: "Completed",
    date: "Mar 19, 2026",
  },
  {
    id: "2",
    transactionId: "TXN-2026-002",
    customerName: "Bob Chen",
    customerEmail: "bob@globex.com",
    orderNumber: "ORD-1002",
    amount: "$289.50",
    method: "PayPal",
    status: "Pending",
    date: "Mar 19, 2026",
  },
  {
    id: "3",
    transactionId: "TXN-2026-003",
    customerName: "Sara Kim",
    customerEmail: "sara@initech.com",
    orderNumber: "ORD-1003",
    amount: "$78.00",
    method: "Credit Card",
    status: "Completed",
    date: "Mar 18, 2026",
  },
  {
    id: "4",
    transactionId: "TXN-2026-004",
    customerName: "Tom Rivera",
    customerEmail: "tom@umbrella.com",
    orderNumber: "ORD-1004",
    amount: "$195.00",
    method: "Debit Card",
    status: "Failed",
    date: "Mar 18, 2026",
  },
  {
    id: "5",
    transactionId: "TXN-2026-005",
    customerName: "Nina Patel",
    customerEmail: "nina@hooli.com",
    orderNumber: "ORD-1005",
    amount: "$45.00",
    method: "Credit Card",
    status: "Refunded",
    date: "Mar 17, 2026",
  },
];

const statusVariantMap: Record<string, any> = {
  Completed: "completed",
  Pending: "pending",
  Failed: "cancelled",
  Refunded: "closedLost",
};

export const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [payments] = React.useState<Payment[]>(samplePayments);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredPayments = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return payments;

    return payments.filter((payment) =>
      [
        payment.transactionId,
        payment.customerName,
        payment.customerEmail,
        payment.orderNumber,
        payment.method,
        payment.status,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [payments, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = payments.length;
    const completed = payments.filter((p) => p.status === "Completed").length;
    const pending = payments.filter((p) => p.status === "Pending").length;
    const failed = payments.filter((p) => p.status === "Failed").length;
    const totalAmount = payments
      .filter((p) => p.status === "Completed")
      .reduce((sum, p) => sum + parseFloat(p.amount.replace("$", "")), 0);

    return {
      total,
      completed,
      pending,
      failed,
      totalAmount: `$${totalAmount.toFixed(2)}`,
    };
  }, [payments]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Payments</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track payment status, transaction lookup, and payment method filters
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Total Payments
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <CreditCard size={22} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Completed
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Pending
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Clock size={22} className="text-amber-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Failed
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.failed}
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
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Total Revenue
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.totalAmount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <DollarSign size={22} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {filteredPayments.length} payments
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search payments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-500 outline-none transition-all focus:border-gray-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      filteredPayments.length > 0 &&
                      selectedIds.length === filteredPayments.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? filteredPayments.map((p) => p.id)
                          : [],
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : null}
              {filteredPayments.map((payment, idx) => (
                <tr
                  key={payment.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(payment.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, payment.id]
                            : current.filter((id) => id !== payment.id),
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-gray-900">
                      {payment.transactionId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                      {payment.orderNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.method}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={payment.status}
                      variant={statusVariantMap[payment.status]}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/payments/${payment.id}`)
                        }
                        className="text-gray-400 transition-colors hover:text-gray-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log("Delete", payment.id)}
                        className="text-gray-400 transition-colors hover:text-red-600"
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
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
            <p className="text-sm text-gray-600">
              Showing 1-5 of {filteredPayments.length}
            </p>
            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-sm font-medium text-white">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
