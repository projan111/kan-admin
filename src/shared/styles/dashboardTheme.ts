// Dashboard Theme Configuration
// Multi-color blue theme with light to dark variations

export const statCardColors = {
  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    textColor: "text-blue-900",
  },
  sky: {
    bg: "bg-sky-50",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    textColor: "text-sky-900",
  },
  indigo: {
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    textColor: "text-indigo-900",
  },
  purple: {
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    textColor: "text-purple-900",
  },
  violet: {
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    textColor: "text-violet-900",
  },
  cyan: {
    bg: "bg-cyan-50",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    textColor: "text-cyan-900",
  },
  emerald: {
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-900",
  },
  teal: {
    bg: "bg-teal-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    textColor: "text-teal-900",
  },
  rose: {
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    textColor: "text-rose-900",
  },
  amber: {
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    textColor: "text-amber-900",
  },
} as const;

export const statusColors = {
  proposal: "bg-purple-50 text-purple-700 border-purple-200",
  qualified: "bg-blue-50 text-blue-700 border-blue-200",
  negotiation: "bg-amber-50 text-amber-700 border-amber-200",
  closedWon: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closedLost: "bg-red-50 text-red-700 border-red-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-gray-50 text-gray-700 border-gray-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  expired: "bg-red-50 text-red-700 border-red-200",
  expiring: "bg-amber-50 text-amber-700 border-amber-200",
} as const;

export const tableStyles = {
  container: "rounded-xl border border-gray-200 bg-white shadow-sm",
  header: "flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4",
  title: "text-base font-semibold text-gray-900",
  tabsContainer: "flex flex-wrap gap-1 border-b border-gray-200 px-6 py-2",
  tab: "relative px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg",
  tabActive: "bg-gray-900 text-white",
  tabInactive: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
  tableHeader: "border-b border-gray-100 bg-gray-50",
  tableHeaderCell: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600",
  tableRow: "border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-0",
  tableCell: "px-6 py-4 text-sm",
  pagination: "flex items-center justify-between px-6 py-4 border-t border-gray-100",
} as const;

export const buttonStyles = {
  primary: "bg-gray-900 text-white hover:bg-gray-800 font-medium rounded-lg px-4 py-2 text-sm transition-colors",
  secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-medium rounded-lg px-4 py-2 text-sm transition-colors",
  danger: "bg-red-600 text-white hover:bg-red-700 font-medium rounded-lg px-4 py-2 text-sm transition-colors",
  icon: "grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors",
} as const;
