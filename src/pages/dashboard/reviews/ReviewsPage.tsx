import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type Review = {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  status: "Published" | "Pending" | "Rejected";
  type: "Product" | "Site";
  date: string;
};

// Sample data
const sampleReviews: Review[] = [
  {
    id: "1",
    productName: "Matte Primer",
    customerName: "Alice Martin",
    rating: 5,
    comment: "Excellent product! Highly recommend.",
    status: "Published",
    type: "Product",
    date: "Mar 19, 2026",
  },
  {
    id: "2",
    productName: "Foundation",
    customerName: "Bob Chen",
    rating: 4,
    comment: "Good quality, but a bit pricey.",
    status: "Published",
    type: "Product",
    date: "Mar 18, 2026",
  },
  {
    id: "3",
    productName: "Website Experience",
    customerName: "Sara Kim",
    rating: 5,
    comment: "Great website, easy to navigate!",
    status: "Published",
    type: "Site",
    date: "Mar 17, 2026",
  },
  {
    id: "4",
    productName: "Lipstick",
    customerName: "Tom Rivera",
    rating: 2,
    comment: "Color doesn't match the description.",
    status: "Pending",
    type: "Product",
    date: "Mar 16, 2026",
  },
  {
    id: "5",
    productName: "Mascara",
    customerName: "Nina Patel",
    rating: 1,
    comment: "Terrible quality, very disappointed.",
    status: "Rejected",
    type: "Product",
    date: "Mar 15, 2026",
  },
];

const statusVariantMap: Record<string, any> = {
  Published: "completed",
  Pending: "pending",
  Rejected: "cancelled",
};

export const ReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [reviews] = React.useState<Review[]>(sampleReviews);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredReviews = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return reviews;

    return reviews.filter((review) =>
      [
        review.productName,
        review.customerName,
        review.comment,
        review.status,
        review.type,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [reviews, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = reviews.length;
    const published = reviews.filter((r) => r.status === "Published").length;
    const pending = reviews.filter((r) => r.status === "Pending").length;
    const rejected = reviews.filter((r) => r.status === "Rejected").length;
    const avgRating = (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1);

    return { total, published, pending, rejected, avgRating };
  }, [reviews]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Reviews</h1>
          <p className="mt-2 text-sm text-gray-600">
            Moderate customer reviews, publish/unpublish, and manage feedback
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Total Reviews
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <MessageSquare size={22} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Published
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.published}
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
                <MessageSquare size={22} className="text-amber-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Rejected
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.rejected}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle size={22} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-yellow-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                  Avg Rating
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {stats.avgRating}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <Star size={22} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {filteredReviews.length} reviews
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search reviews..."
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
                      filteredReviews.length > 0 &&
                      selectedIds.length === filteredReviews.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? filteredReviews.map((r) => r.id)
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
                  Product/Site
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
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
              {filteredReviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No reviews found.
                  </td>
                </tr>
              ) : null}
              {filteredReviews.map((review, idx) => (
                <tr
                  key={review.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(review.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, review.id]
                            : current.filter((id) => id !== review.id),
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {review.productName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {review.customerName}
                  </td>
                  <td className="px-6 py-4">{renderStars(review.rating)}</td>
                  <td className="px-6 py-4">
                    <p className="max-w-xs truncate text-sm text-gray-600">
                      {review.comment}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        review.type === "Product"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {review.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={review.status}
                      variant={statusVariantMap[review.status]}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {review.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/reviews/${review.id}`)
                        }
                        className="text-gray-400 transition-colors hover:text-gray-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log("Delete", review.id)}
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
              Showing 1-5 of {filteredReviews.length}
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
