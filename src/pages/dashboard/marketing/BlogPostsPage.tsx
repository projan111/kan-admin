import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Eye, Clock, CheckCircle, Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type BlogPost = {
  id: string;
  title: string;
  author: string;
  category: string;
  status: "Published" | "Draft" | "Scheduled";
  views: number;
  publishedDate: string;
  excerpt: string;
};

// Sample data
const samplePosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Beauty Tips for Flawless Skin",
    author: "Sarah Johnson",
    category: "Skincare",
    status: "Published",
    views: 2543,
    publishedDate: "May 1, 2026",
    excerpt: "Discover the secrets to achieving radiant, healthy skin...",
  },
  {
    id: "2",
    title: "Summer Makeup Trends 2026",
    author: "Emily Chen",
    category: "Makeup",
    status: "Published",
    views: 1876,
    publishedDate: "May 5, 2026",
    excerpt: "Get ready for summer with these hot makeup trends...",
  },
  {
    id: "3",
    title: "How to Choose the Right Foundation",
    author: "Maria Garcia",
    category: "Tutorials",
    status: "Draft",
    views: 0,
    publishedDate: "May 15, 2026",
    excerpt: "A comprehensive guide to finding your perfect match...",
  },
  {
    id: "4",
    title: "New Product Launch: Liquid Lipstick Collection",
    author: "Sarah Johnson",
    category: "Product News",
    status: "Scheduled",
    views: 0,
    publishedDate: "May 20, 2026",
    excerpt: "Introducing our latest collection of long-lasting lipsticks...",
  },
  {
    id: "5",
    title: "Behind the Scenes: Our Manufacturing Process",
    author: "David Kim",
    category: "Company",
    status: "Published",
    views: 892,
    publishedDate: "Apr 28, 2026",
    excerpt: "Take a look at how we create our quality products...",
  },
];

const statusVariantMap: Record<string, any> = {
  Published: "completed",
  Draft: "pending",
  Scheduled: "qualified",
};

export const BlogPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [posts] = React.useState<BlogPost[]>(samplePosts);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredPosts = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return posts;

    return posts.filter((post) =>
      [post.title, post.author, post.category, post.status].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [posts, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === "Published").length;
    const draft = posts.filter((p) => p.status === "Draft").length;
    const scheduled = posts.filter((p) => p.status === "Scheduled").length;
    const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

    return { total, published, draft, scheduled, totalViews };
  }, [posts]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-zinc-900">Blog Posts</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage blog content, articles, and publishing schedule
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Total Posts
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <FileText size={22} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Published
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
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
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Drafts
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.draft}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Edit size={22} className="text-amber-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-purple-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Scheduled
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.scheduled}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Clock size={22} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-cyan-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Total Views
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100">
                <Eye size={22} className="text-cyan-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {filteredPosts.length} posts
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder-gray-500 outline-none transition-all focus:border-gray-400"
            />
            <button
              onClick={() => navigate("/dashboard/blog-posts/create")}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              + New Post
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
                      filteredPosts.length > 0 &&
                      selectedIds.length === filteredPosts.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? filteredPosts.map((p) => p.id) : [],
                      )
                    }
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Category
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Published
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No blog posts found.
                  </td>
                </tr>
              ) : null}
              {filteredPosts.map((post, idx) => (
                <tr
                  key={post.id}
                  className="transition-colors hover:bg-zinc-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(post.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, post.id]
                            : current.filter((id) => id !== post.id),
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
                        {post.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {post.excerpt}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {post.author}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-zinc-900">
                    {post.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={post.status}
                      variant={statusVariantMap[post.status]}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {post.publishedDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/blog-posts/${post.id}`)
                        }
                        className="text-slate-400 transition-colors hover:text-zinc-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log("Delete", post.id)}
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
              Showing 1-{Math.min(filteredPosts.length, 10)} of{" "}
              {filteredPosts.length}
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
