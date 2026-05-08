import React from "react";
import { useNavigate } from "react-router-dom";
import { FolderTree, Layers, Tag, Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  subcategories: number;
  products: number;
  status: "Active" | "Inactive";
  createdAt: string;
};

// Sample data
const sampleCategories: Category[] = [
  {
    id: "1",
    name: "Skincare",
    slug: "skincare",
    description: "Face and body care products",
    subcategories: 5,
    products: 42,
    status: "Active",
    createdAt: "Mar 15, 2026",
  },
  {
    id: "2",
    name: "Makeup",
    slug: "makeup",
    description: "Cosmetics and beauty products",
    subcategories: 8,
    products: 67,
    status: "Active",
    createdAt: "Mar 14, 2026",
  },
  {
    id: "3",
    name: "Hair Care",
    slug: "hair-care",
    description: "Shampoos, conditioners, and treatments",
    subcategories: 4,
    products: 28,
    status: "Active",
    createdAt: "Mar 13, 2026",
  },
  {
    id: "4",
    name: "Fragrances",
    slug: "fragrances",
    description: "Perfumes and body sprays",
    subcategories: 3,
    products: 15,
    status: "Inactive",
    createdAt: "Mar 12, 2026",
  },
  {
    id: "5",
    name: "Tools & Accessories",
    slug: "tools-accessories",
    description: "Beauty tools and accessories",
    subcategories: 6,
    products: 34,
    status: "Active",
    createdAt: "Mar 11, 2026",
  },
];

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [categories] = React.useState<Category[]>(sampleCategories);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredCategories = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((category) =>
      [
        category.name,
        category.slug,
        category.description,
        category.status,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [categories, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = categories.length;
    const active = categories.filter((c) => c.status === "Active").length;
    const totalSubcategories = categories.reduce(
      (sum, c) => sum + c.subcategories,
      0,
    );
    const totalProducts = categories.reduce((sum, c) => sum + c.products, 0);

    return { total, active, totalSubcategories, totalProducts };
  }, [categories]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-zinc-900">Categories</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage product categories, subcategories, and catalog structure
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Total Categories
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <FolderTree size={22} className="text-blue-600" />
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
                <Tag size={22} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-purple-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Subcategories
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.totalSubcategories}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Layers size={22} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-cyan-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Total Products
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100">
                <Tag size={22} className="text-cyan-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {filteredCategories.length} categories
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder-slate-500 outline-none transition-all focus:border-zinc-400"
            />
            <button
              onClick={() => navigate("/dashboard/categories/create")}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              + New Category
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
                      filteredCategories.length > 0 &&
                      selectedIds.length === filteredCategories.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? filteredCategories.map((c) => c.id)
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
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Description
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Subcategories
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Products
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
            <tbody className="divide-y divide-zinc-200 bg-white">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No categories found.
                  </td>
                </tr>
              ) : null}
              {filteredCategories.map((category, idx) => (
                <tr
                  key={category.id}
                  className="transition-colors hover:bg-zinc-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(category.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, category.id]
                            : current.filter((id) => id !== category.id),
                        )
                      }
                      className="h-4 w-4 rounded border-zinc-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <FolderTree size={18} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-zinc-900">
                        {category.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-zinc-900">
                    {category.subcategories}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-zinc-900">
                    {category.products}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={category.status}
                      variant={
                        category.status === "Active" ? "active" : "inactive"
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {category.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/categories/${category.id}`)
                        }
                        className="text-slate-400 transition-colors hover:text-zinc-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log("Delete", category.id)}
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
              Showing 1-5 of {filteredCategories.length}
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
