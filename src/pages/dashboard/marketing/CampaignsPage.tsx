import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Send,
  Users,
  TrendingUp,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/dashboard/StatusBadge";

type Campaign = {
  id: string;
  name: string;
  subject: string;
  status: "Sent" | "Scheduled" | "Draft" | "Sending";
  recipients: number;
  opened: number;
  clicked: number;
  scheduledDate: string;
  openRate: number;
};

// Sample data
const sampleCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Spring Sale 2026",
    subject: "🌸 Spring Into Savings - 40% Off Everything!",
    status: "Sent",
    recipients: 12450,
    opened: 5234,
    clicked: 1876,
    scheduledDate: "May 1, 2026 9:00 AM",
    openRate: 42,
  },
  {
    id: "2",
    name: "New Product Announcement",
    subject: "Introducing Our Revolutionary Lipstick Line",
    status: "Scheduled",
    recipients: 8900,
    opened: 0,
    clicked: 0,
    scheduledDate: "May 15, 2026 10:00 AM",
    openRate: 0,
  },
  {
    id: "3",
    name: "Customer Appreciation",
    subject: "Thank You! Here's 25% Off Your Next Order",
    status: "Sent",
    recipients: 5620,
    opened: 2987,
    clicked: 1234,
    scheduledDate: "Apr 28, 2026 2:00 PM",
    openRate: 53,
  },
  {
    id: "4",
    name: "Weekly Newsletter #18",
    subject: "Beauty Tips & Tricks for Summer",
    status: "Draft",
    recipients: 0,
    opened: 0,
    clicked: 0,
    scheduledDate: "May 12, 2026 8:00 AM",
    openRate: 0,
  },
  {
    id: "5",
    name: "Flash Sale Alert",
    subject: "⚡ 2 Hours Only - 50% Off Best Sellers",
    status: "Sending",
    recipients: 15200,
    opened: 3456,
    clicked: 892,
    scheduledDate: "May 8, 2026 12:00 PM",
    openRate: 23,
  },
];

const statusVariantMap: Record<string, any> = {
  Sent: "completed",
  Scheduled: "qualified",
  Draft: "pending",
  Sending: "qualified",
};

export const CampaignsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [campaigns] = React.useState<Campaign[]>(sampleCampaigns);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>(
    [],
  );

  const filteredCampaigns = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return campaigns;

    return campaigns.filter((campaign) =>
      [campaign.name, campaign.subject, campaign.status].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [campaigns, search]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = campaigns.length;
    const sent = campaigns.filter((c) => c.status === "Sent").length;
    const scheduled = campaigns.filter((c) => c.status === "Scheduled").length;
    const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipients, 0);
    const avgOpenRate =
      campaigns
        .filter((c) => c.status === "Sent")
        .reduce((sum, c) => sum + c.openRate, 0) / (sent || 1);

    return { total, sent, scheduled, totalRecipients, avgOpenRate };
  }, [campaigns]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-zinc-900">
            Email Campaigns
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create and manage email campaigns, track performance and engagement
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Total Campaigns
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.total}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Mail size={22} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Sent
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.sent}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <Send size={22} className="text-emerald-600" />
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
                  Total Recipients
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.totalRecipients.toLocaleString()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100">
                <Users size={22} className="text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                  Avg Open Rate
                </p>
                <p className="mt-1 text-3xl font-bold text-zinc-900">
                  {stats.avgOpenRate.toFixed(0)}%
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <TrendingUp size={22} className="text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {filteredCampaigns.length} campaigns
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 placeholder-gray-500 outline-none transition-all focus:border-gray-400"
            />
            <button
              onClick={() => navigate("/dashboard/email-campaigns/create")}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              + New Campaign
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
                      filteredCampaigns.length > 0 &&
                      selectedIds.length === filteredCampaigns.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? filteredCampaigns.map((c) => c.id)
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
                  Campaign
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Recipients
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Opened
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Clicked
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Open Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No campaigns found.
                  </td>
                </tr>
              ) : null}
              {filteredCampaigns.map((campaign, idx) => (
                <tr
                  key={campaign.id}
                  className="transition-colors hover:bg-zinc-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(campaign.id)}
                      onChange={(e) =>
                        setSelectedIds((current) =>
                          e.target.checked
                            ? [...current, campaign.id]
                            : current.filter((id) => id !== campaign.id),
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
                        {campaign.name}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {campaign.subject}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-zinc-900">
                    {campaign.recipients.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">
                    {campaign.opened.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">
                    {campaign.clicked.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-semibold text-zinc-900">
                      {campaign.openRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={campaign.status}
                      variant={statusVariantMap[campaign.status]}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/email-campaigns/${campaign.id}`)
                        }
                        className="text-slate-400 transition-colors hover:text-zinc-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => console.log("Delete", campaign.id)}
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
              Showing 1-{Math.min(filteredCampaigns.length, 10)} of{" "}
              {filteredCampaigns.length}
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
