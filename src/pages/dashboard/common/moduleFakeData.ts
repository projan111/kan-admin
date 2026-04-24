export type FakeBadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

type FakeBadge = Readonly<{
  kind: "badge";
  label: string;
  tone: FakeBadgeTone;
}>;

type FakeBadges = Readonly<{
  kind: "badges";
  items: ReadonlyArray<FakeBadge>;
}>;

type FakeImage = Readonly<{
  kind: "image";
  label: string;
}>;

type FakeToggle = Readonly<{
  kind: "toggle";
  checked: boolean;
}>;

export type FakeCellValue = string | number | FakeBadge | FakeBadges | FakeImage | FakeToggle;

export type FakeModuleColumn = Readonly<{
  key: string;
  label: string;
  align?: "left" | "right";
}>;

export type FakeModuleRow = Readonly<{
  id: string;
}> &
  Readonly<Record<string, FakeCellValue>>;

export type FakeModuleDefinition = Readonly<{
  singularLabel: string;
  searchPlaceholder: string;
  createLabel: string;
  columns: ReadonlyArray<FakeModuleColumn>;
  rows: ReadonlyArray<FakeModuleRow>;
}>;

const badge = (label: string, tone: FakeBadgeTone): FakeBadge => ({ kind: "badge", label, tone });
const badges = (...items: ReadonlyArray<FakeBadge>): FakeBadges => ({ kind: "badges", items });
const image = (label: string): FakeImage => ({ kind: "image", label });
const toggle = (checked: boolean): FakeToggle => ({ kind: "toggle", checked });

const beautyProducts = [
  { name: "Radiance Vitamin C Serum", sku: "BEA-VC-101", price: "$48", category: "Skincare", image: image("Radiance Vitamin C Serum") },
  { name: "Velvet Matte Lip Kit", sku: "BEA-LP-202", price: "$36", category: "Makeup", image: image("Velvet Matte Lip Kit") },
  { name: "Botanical Cleansing Balm", sku: "BEA-CL-303", price: "$42", category: "Skincare", image: image("Botanical Cleansing Balm") },
  { name: "Silk Repair Shampoo", sku: "BEA-HA-404", price: "$28", category: "Haircare", image: image("Silk Repair Shampoo") },
  { name: "Dewdrop Gel Cream", sku: "BEA-MO-505", price: "$52", category: "Moisturizer", image: image("Dewdrop Gel Cream") },
] as const;

export const fakeModuleDefinitions: Readonly<Record<string, FakeModuleDefinition>> = {
  users: {
    singularLabel: "user",
    searchPlaceholder: "Search team / email / access...",
    createLabel: "Create User",
    columns: [
      { key: "name", label: "Name" },
      { key: "team", label: "Team" },
      { key: "access", label: "Access" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "USR-1001", name: "Sophie Carter", team: "Glow Commerce", access: "SUDOADMIN", status: toggle(true), permissions: badges(badge("Create", "success"), badge("Read", "info"), badge("Edit", "neutral"), badge("Delete", "danger")) },
      { id: "USR-1002", name: "Mason Lee", team: "Beauty Ops", access: "ADMIN", status: toggle(true), permissions: badges(badge("Read", "info"), badge("Edit", "neutral")) },
      { id: "USR-1003", name: "Ava Khan", team: "Merchandising", access: "EDITOR", status: toggle(false), permissions: badges(badge("Pending", "warning")) },
      { id: "USR-1004", name: "Noah Brown", team: "Customer Care", access: "SUPPORT", status: toggle(true), permissions: badges(badge("Read", "info"), badge("Edit", "neutral")) },
      { id: "USR-1005", name: "Emma Wilson", team: "Lifecycle Marketing", access: "ADMIN", status: toggle(true), permissions: badges(badge("Create", "success"), badge("Read", "info"), badge("Edit", "neutral")) },
    ],
  },
  customers: {
    singularLabel: "customer",
    searchPlaceholder: "Search customer / concern / loyalty...",
    createLabel: "Create Customer",
    columns: [
      { key: "name", label: "Name" },
      { key: "routine", label: "Beauty Concern" },
      { key: "value", label: "LTV", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "CUS-2001", name: "Olivia Johnson", routine: "Brightening Routine", value: "$2,480", status: toggle(true), permissions: badges(badge("VIP", "success"), badge("Active", "info")) },
      { id: "CUS-2002", name: "Liam Patel", routine: "Barrier Repair", value: "$684", status: toggle(true), permissions: badges(badge("Returning", "info")) },
      { id: "CUS-2003", name: "Isabella Chen", routine: "Daily SPF", value: "$148", status: toggle(false), permissions: badges(badge("New", "neutral")) },
      { id: "CUS-2004", name: "Ethan Miller", routine: "Acne Control", value: "$512", status: toggle(true), permissions: badges(badge("At Risk", "warning")) },
      { id: "CUS-2005", name: "Mia Garcia", routine: "Lip And Cheek", value: "$1,396", status: toggle(true), permissions: badges(badge("Loyal", "success")) },
    ],
  },
  products: {
    singularLabel: "product",
    searchPlaceholder: "Search product / SKU / beauty line...",
    createLabel: "Create Product",
    columns: [
      { key: "image", label: "Image" },
      { key: "name", label: "Name" },
      { key: "price", label: "Price", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: beautyProducts.map((product, index) => ({
      id: `PRD-${3001 + index}`,
      image: product.image,
      name: product.name,
      price: product.price,
      status: toggle(index !== 2),
      permissions: badges(
        ...(index === 0
          ? [badge("Create", "success"), badge("Read", "info"), badge("Edit", "neutral"), badge("Delete", "danger")]
          : index === 1
            ? [badge("Active", "success"), badge("Inactive", "neutral")]
            : [badge("Read", "info"), badge("Edit", "neutral"), badge("Delete", "danger")])
      ),
    })),
  },
  orders: {
    singularLabel: "order",
    searchPlaceholder: "Search order / product / order state...",
    createLabel: "Create Order",
    columns: [
      { key: "image", label: "Image" },
      { key: "name", label: "Name" },
      { key: "price", label: "Price", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "ORD-4001", image: image("Radiance Vitamin C Serum"), name: "Order #10482 · Radiance Vitamin C Serum", price: "$48", status: toggle(true), permissions: badges(badge("Packed", "info"), badge("Paid", "success")) },
      { id: "ORD-4002", image: image("Velvet Matte Lip Kit"), name: "Order #10481 · Velvet Matte Lip Kit", price: "$36", status: toggle(false), permissions: badges(badge("Pending", "warning")) },
      { id: "ORD-4003", image: image("Botanical Cleansing Balm"), name: "Order #10480 · Botanical Cleansing Balm", price: "$42", status: toggle(true), permissions: badges(badge("Create", "success"), badge("Read", "info"), badge("Edit", "neutral")) },
      { id: "ORD-4004", image: image("Silk Repair Shampoo"), name: "Order #10479 · Silk Repair Shampoo", price: "$28", status: toggle(true), permissions: badges(badge("Delivered", "success")) },
      { id: "ORD-4005", image: image("Dewdrop Gel Cream"), name: "Order #10478 · Dewdrop Gel Cream", price: "$52", status: toggle(false), permissions: badges(badge("Returned", "danger")) },
    ],
  },
  inventory: {
    singularLabel: "inventory item",
    searchPlaceholder: "Search SKU / product / stock state...",
    createLabel: "Create Inventory Item",
    columns: [
      { key: "image", label: "Image" },
      { key: "name", label: "Name" },
      { key: "price", label: "Stock", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "INV-5001", image: image("Radiance Vitamin C Serum"), name: "Radiance Vitamin C Serum", price: "248 units", status: toggle(true), permissions: badges(badge("Healthy", "success")) },
      { id: "INV-5002", image: image("Velvet Matte Lip Kit"), name: "Velvet Matte Lip Kit", price: "82 units", status: toggle(false), permissions: badges(badge("Monitor", "warning")) },
      { id: "INV-5003", image: image("Botanical Cleansing Balm"), name: "Botanical Cleansing Balm", price: "21 units", status: toggle(true), permissions: badges(badge("Restock", "danger")) },
      { id: "INV-5004", image: image("Silk Repair Shampoo"), name: "Silk Repair Shampoo", price: "176 units", status: toggle(true), permissions: badges(badge("Healthy", "success")) },
      { id: "INV-5005", image: image("Dewdrop Gel Cream"), name: "Dewdrop Gel Cream", price: "34 units", status: toggle(false), permissions: badges(badge("Low Stock", "warning")) },
    ],
  },
  payments: {
    singularLabel: "payment",
    searchPlaceholder: "Search payment / order / settlement...",
    createLabel: "Create Payment",
    columns: [
      { key: "name", label: "Name" },
      { key: "method", label: "Method" },
      { key: "price", label: "Amount", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "PAY-6001", name: "Radiance Serum Checkout", method: "Stripe", price: "$48", status: toggle(true), permissions: badges(badge("Captured", "success")) },
      { id: "PAY-6002", name: "Lip Kit Checkout", method: "PayPal", price: "$36", status: toggle(false), permissions: badges(badge("Pending", "warning")) },
      { id: "PAY-6003", name: "Cleansing Balm Checkout", method: "Khalti", price: "$42", status: toggle(true), permissions: badges(badge("Authorized", "info")) },
      { id: "PAY-6004", name: "Shampoo Checkout", method: "Stripe", price: "$28", status: toggle(true), permissions: badges(badge("Captured", "success")) },
      { id: "PAY-6005", name: "Gel Cream Refund", method: "Stripe", price: "$52", status: toggle(false), permissions: badges(badge("Refunded", "danger")) },
    ],
  },
  reports: {
    singularLabel: "report",
    searchPlaceholder: "Search report / beauty line / export...",
    createLabel: "Create Report",
    columns: [
      { key: "name", label: "Name" },
      { key: "scope", label: "Scope" },
      { key: "price", label: "Value", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "REP-7001", name: "Glow Line Sales", scope: "Last 30 Days", price: "$48.2K", status: toggle(true), permissions: badges(badge("Ready", "success")) },
      { id: "REP-7002", name: "Skincare Margin", scope: "Category", price: "38%", status: toggle(true), permissions: badges(badge("Ready", "success")) },
      { id: "REP-7003", name: "Returns Audit", scope: "Weekly", price: "$3.4K", status: toggle(false), permissions: badges(badge("Queued", "warning")) },
      { id: "REP-7004", name: "VIP Retention", scope: "Quarterly", price: "74%", status: toggle(true), permissions: badges(badge("Ready", "success")) },
      { id: "REP-7005", name: "Shade Sell Through", scope: "Current", price: "61%", status: toggle(false), permissions: badges(badge("Processing", "info")) },
    ],
  },
  taxes: {
    singularLabel: "tax rule",
    searchPlaceholder: "Search region / VAT / beauty market...",
    createLabel: "Create Tax Rule",
    columns: [
      { key: "name", label: "Name" },
      { key: "region", label: "Region" },
      { key: "price", label: "Rate", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "TAX-8001", name: "Skincare Tax Rule", region: "California", price: "7.25%", status: toggle(true), permissions: badges(badge("Active", "success")) },
      { id: "TAX-8002", name: "Makeup VAT", region: "Germany", price: "19%", status: toggle(true), permissions: badges(badge("Active", "success")) },
      { id: "TAX-8003", name: "Haircare VAT", region: "United Kingdom", price: "20%", status: toggle(false), permissions: badges(badge("Review", "warning")) },
      { id: "TAX-8004", name: "Beauty Box VAT", region: "Nepal", price: "13%", status: toggle(true), permissions: badges(badge("Draft", "neutral")) },
      { id: "TAX-8005", name: "Fragrance Import Duty", region: "UAE", price: "5%", status: toggle(false), permissions: badges(badge("Pending", "warning")) },
    ],
  },
  discounts: {
    singularLabel: "discount",
    searchPlaceholder: "Search promo / bundle / offer...",
    createLabel: "Create Discount",
    columns: [
      { key: "name", label: "Name" },
      { key: "code", label: "Code" },
      { key: "price", label: "Value", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "DSC-9001", name: "Glow Starter Offer", code: "GLOW15", price: "15%", status: toggle(true), permissions: badges(badge("Active", "success")) },
      { id: "DSC-9002", name: "Lip Duo Discount", code: "LIPDUO", price: "$10", status: toggle(true), permissions: badges(badge("Create", "success"), badge("Read", "info")) },
      { id: "DSC-9003", name: "Hair Repair Promo", code: "SILK20", price: "20%", status: toggle(false), permissions: badges(badge("Ending Soon", "warning")) },
      { id: "DSC-9004", name: "New Customer Glow", code: "WELCOME5", price: "$5", status: toggle(true), permissions: badges(badge("Read", "info"), badge("Edit", "neutral"), badge("Delete", "danger")) },
      { id: "DSC-9005", name: "Night Cream Bundle", code: "NIGHTSET", price: "12%", status: toggle(false), permissions: badges(badge("Expired", "danger")) },
    ],
  },
  campaigns: {
    singularLabel: "campaign",
    searchPlaceholder: "Search launch / message / beauty line...",
    createLabel: "Create Campaign",
    columns: [
      { key: "name", label: "Name" },
      { key: "channel", label: "Channel" },
      { key: "price", label: "Reach", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "CMP-1001", name: "Spring Glow Launch", channel: "Email", price: "48,200", status: toggle(true), permissions: badges(badge("Running", "success")) },
      { id: "CMP-1002", name: "Lip Kit Reminder", channel: "SMS", price: "18,440", status: toggle(true), permissions: badges(badge("Running", "success")) },
      { id: "CMP-1003", name: "Serum Waitlist Push", channel: "Push", price: "27,820", status: toggle(false), permissions: badges(badge("Queued", "warning")) },
      { id: "CMP-1004", name: "Haircare Winback", channel: "Email", price: "12,900", status: toggle(true), permissions: badges(badge("Draft", "neutral")) },
      { id: "CMP-1005", name: "SPF Awareness", channel: "Email", price: "39,100", status: toggle(false), permissions: badges(badge("Completed", "info")) },
    ],
  },
  loyalty: {
    singularLabel: "loyalty tier",
    searchPlaceholder: "Search tier / rewards / membership...",
    createLabel: "Create Loyalty Tier",
    columns: [
      { key: "name", label: "Name" },
      { key: "perk", label: "Perk" },
      { key: "price", label: "Members", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "LOY-1101", name: "Glow Bronze", perk: "Beauty Points", price: "4,820", status: toggle(true), permissions: badges(badge("Active", "success")) },
      { id: "LOY-1102", name: "Glow Silver", perk: "Priority Samples", price: "1,940", status: toggle(true), permissions: badges(badge("Active", "success")) },
      { id: "LOY-1103", name: "Glow Gold", perk: "Free Shipping", price: "680", status: toggle(true), permissions: badges(badge("Create", "success"), badge("Edit", "neutral")) },
      { id: "LOY-1104", name: "Glow VIP", perk: "Early Access", price: "128", status: toggle(false), permissions: badges(badge("Pilot", "info")) },
      { id: "LOY-1105", name: "Dormant Revival", perk: "Winback Gift", price: "332", status: toggle(false), permissions: badges(badge("Review", "warning")) },
    ],
  },
  reviews: {
    singularLabel: "review",
    searchPlaceholder: "Search review / beauty product / rating...",
    createLabel: "Create Review",
    columns: [
      { key: "image", label: "Image" },
      { key: "name", label: "Name" },
      { key: "price", label: "Rating", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "REV-1201", image: image("Radiance Vitamin C Serum"), name: "Radiance Vitamin C Serum", price: "4.8/5", status: toggle(true), permissions: badges(badge("Published", "success")) },
      { id: "REV-1202", image: image("Velvet Matte Lip Kit"), name: "Velvet Matte Lip Kit", price: "4.6/5", status: toggle(false), permissions: badges(badge("Flagged", "warning")) },
      { id: "REV-1203", image: image("Botanical Cleansing Balm"), name: "Botanical Cleansing Balm", price: "4.2/5", status: toggle(true), permissions: badges(badge("Pending", "info")) },
      { id: "REV-1204", image: image("Silk Repair Shampoo"), name: "Silk Repair Shampoo", price: "4.4/5", status: toggle(true), permissions: badges(badge("Published", "success")) },
      { id: "REV-1205", image: image("Dewdrop Gel Cream"), name: "Dewdrop Gel Cream", price: "3.9/5", status: toggle(false), permissions: badges(badge("Hidden", "danger")) },
    ],
  },
  shipping: {
    singularLabel: "shipping rule",
    searchPlaceholder: "Search zone / carrier / SLA...",
    createLabel: "Create Shipping Rule",
    columns: [
      { key: "name", label: "Name" },
      { key: "carrier", label: "Carrier" },
      { key: "price", label: "Rate", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "SHP-1301", name: "Glow Express", carrier: "DHL", price: "$12", status: toggle(true), permissions: badges(badge("Active", "success")) },
      { id: "SHP-1302", name: "Routine Standard", carrier: "UPS", price: "$6.50", status: toggle(true), permissions: badges(badge("Create", "success"), badge("Read", "info")) },
      { id: "SHP-1303", name: "International Beauty", carrier: "FedEx", price: "$28", status: toggle(false), permissions: badges(badge("Monitor", "warning")) },
      { id: "SHP-1304", name: "Sample Mailer", carrier: "Local Partner", price: "$4", status: toggle(true), permissions: badges(badge("Edit", "neutral")) },
      { id: "SHP-1305", name: "Store Pickup", carrier: "Pickup", price: "$0", status: toggle(true), permissions: badges(badge("Active", "success")) },
    ],
  },
  returns: {
    singularLabel: "return request",
    searchPlaceholder: "Search return / issue / refund state...",
    createLabel: "Create Return",
    columns: [
      { key: "name", label: "Name" },
      { key: "reason", label: "Reason" },
      { key: "price", label: "Refund", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "RMA-1401", name: "Radiance Serum Return", reason: "Damaged Pump", price: "$48", status: toggle(true), permissions: badges(badge("Approved", "success")) },
      { id: "RMA-1402", name: "Lip Kit Return", reason: "Wrong Shade", price: "$36", status: toggle(false), permissions: badges(badge("Pending", "warning")) },
      { id: "RMA-1403", name: "Cleansing Balm Return", reason: "Allergy Concern", price: "$42", status: toggle(true), permissions: badges(badge("Received", "info")) },
      { id: "RMA-1404", name: "Shampoo Return", reason: "Late Delivery", price: "$28", status: toggle(true), permissions: badges(badge("Refunded", "success")) },
      { id: "RMA-1405", name: "Gel Cream Return", reason: "Opened Item", price: "$0", status: toggle(false), permissions: badges(badge("Rejected", "danger")) },
    ],
  },
  cms: {
    singularLabel: "content item",
    searchPlaceholder: "Search page / campaign / publish state...",
    createLabel: "Create Content",
    columns: [
      { key: "name", label: "Name" },
      { key: "owner", label: "Owner" },
      { key: "price", label: "SEO", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "CMS-1501", name: "Glow Starter Homepage", owner: "Content Team", price: "92", status: toggle(true), permissions: badges(badge("Published", "success")) },
      { id: "CMS-1502", name: "Vitamin C Launch Page", owner: "Marketing", price: "88", status: toggle(true), permissions: badges(badge("Scheduled", "info")) },
      { id: "CMS-1503", name: "Lip Duo Landing Page", owner: "Growth", price: "81", status: toggle(false), permissions: badges(badge("Draft", "neutral")) },
      { id: "CMS-1504", name: "Beauty FAQ", owner: "Support", price: "76", status: toggle(false), permissions: badges(badge("Needs Review", "warning")) },
      { id: "CMS-1505", name: "Brand Story", owner: "Brand Team", price: "90", status: toggle(true), permissions: badges(badge("Published", "success")) },
    ],
  },
  "ai-insights": {
    singularLabel: "insight",
    searchPlaceholder: "Search forecast / beauty trend / signal...",
    createLabel: "Create Insight",
    columns: [
      { key: "name", label: "Name" },
      { key: "category", label: "Category" },
      { key: "price", label: "Confidence", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "AI-1601", name: "Vitamin C demand will spike", category: "Forecasting", price: "91%", status: toggle(true), permissions: badges(badge("Recommended", "success")) },
      { id: "AI-1602", name: "Lip duo lifts AOV", category: "Pricing", price: "86%", status: toggle(true), permissions: badges(badge("Test", "info")) },
      { id: "AI-1603", name: "Customers drop at shipping step", category: "Checkout", price: "88%", status: toggle(false), permissions: badges(badge("Action Needed", "warning")) },
      { id: "AI-1604", name: "Glow Serum stockout risk", category: "Inventory", price: "93%", status: toggle(false), permissions: badges(badge("Urgent", "danger")) },
      { id: "AI-1605", name: "SMS works best for launch reminders", category: "Lifecycle", price: "74%", status: toggle(true), permissions: badges(badge("Observed", "neutral")) },
    ],
  },
  "multi-vendor": {
    singularLabel: "vendor",
    searchPlaceholder: "Search vendor / brand / payout...",
    createLabel: "Create Vendor",
    columns: [
      { key: "name", label: "Name" },
      { key: "line", label: "Beauty Line" },
      { key: "price", label: "Payout", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "VEN-1701", name: "Luna Skin Labs", line: "Clinical Skincare", price: "$8,420", status: toggle(true), permissions: badges(badge("Active", "success")) },
      { id: "VEN-1702", name: "Petal Color Co.", line: "Color Cosmetics", price: "$4,180", status: toggle(true), permissions: badges(badge("Active", "success")) },
      { id: "VEN-1703", name: "Silk Root Care", line: "Haircare", price: "$1,240", status: toggle(false), permissions: badges(badge("Pending Approval", "warning")) },
      { id: "VEN-1704", name: "Glow Rituals", line: "Bath & Body", price: "$2,830", status: toggle(true), permissions: badges(badge("Onboarding", "info")) },
      { id: "VEN-1705", name: "Dew Atelier", line: "Premium Moisture", price: "$980", status: toggle(false), permissions: badges(badge("Paused", "danger")) },
    ],
  },
  "multi-store": {
    singularLabel: "storefront",
    searchPlaceholder: "Search storefront / region / catalog...",
    createLabel: "Create Storefront",
    columns: [
      { key: "name", label: "Name" },
      { key: "region", label: "Region" },
      { key: "price", label: "Catalog", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "STR-1801", name: "US Glow Store", region: "North America", price: "8,240 SKUs", status: toggle(true), permissions: badges(badge("Live", "success")) },
      { id: "STR-1802", name: "EU Skin Store", region: "Europe", price: "7,940 SKUs", status: toggle(true), permissions: badges(badge("Live", "success")) },
      { id: "STR-1803", name: "UK Beauty Store", region: "United Kingdom", price: "7,860 SKUs", status: toggle(false), permissions: badges(badge("Syncing", "info")) },
      { id: "STR-1804", name: "APAC Rituals", region: "Asia Pacific", price: "3,420 SKUs", status: toggle(true), permissions: badges(badge("Beta", "warning")) },
      { id: "STR-1805", name: "MENA Fragrance", region: "Middle East", price: "2,140 SKUs", status: toggle(false), permissions: badges(badge("Draft", "neutral")) },
    ],
  },
  subscriptions: {
    singularLabel: "subscription plan",
    searchPlaceholder: "Search plan / refill / subscribers...",
    createLabel: "Create Subscription",
    columns: [
      { key: "name", label: "Name" },
      { key: "cadence", label: "Cadence" },
      { key: "price", label: "MRR", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "SUB-1901", name: "Daily Glow Refill", cadence: "Monthly", price: "$22,200", status: toggle(true), permissions: badges(badge("Active", "success")) },
      { id: "SUB-1902", name: "Lip Library Box", cadence: "Monthly", price: "$18,470", status: toggle(true), permissions: badges(badge("Active", "success")) },
      { id: "SUB-1903", name: "Barrier Repair Kit", cadence: "Quarterly", price: "$7,920", status: toggle(false), permissions: badges(badge("Review", "warning")) },
      { id: "SUB-1904", name: "VIP Serum Club", cadence: "Annual", price: "$9,860", status: toggle(true), permissions: badges(badge("Pilot", "info")) },
      { id: "SUB-1905", name: "Legacy Beauty Box", cadence: "Monthly", price: "$1,140", status: toggle(false), permissions: badges(badge("Sunset", "danger")) },
    ],
  },
  "bundle-products": {
    singularLabel: "bundle",
    searchPlaceholder: "Search beauty set / kit / bundle...",
    createLabel: "Create Bundle",
    columns: [
      { key: "image", label: "Image" },
      { key: "name", label: "Name" },
      { key: "price", label: "Price", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "BND-2001", image: image("Glow Starter Set"), name: "Glow Starter Set", price: "$96", status: toggle(true), permissions: badges(badge("Create", "success"), badge("Read", "info"), badge("Edit", "neutral")) },
      { id: "BND-2002", image: image("Lip Duo Collection"), name: "Lip Duo Collection", price: "$58", status: toggle(true), permissions: badges(badge("Active", "success")) },
      { id: "BND-2003", image: image("Hair Repair Ritual"), name: "Hair Repair Ritual", price: "$74", status: toggle(false), permissions: badges(badge("Low Margin", "warning")) },
      { id: "BND-2004", image: image("Night Reset Pair"), name: "Night Reset Pair", price: "$102", status: toggle(true), permissions: badges(badge("Read", "info"), badge("Edit", "neutral")) },
      { id: "BND-2005", image: image("Hydration Duo"), name: "Hydration Duo", price: "$88", status: toggle(false), permissions: badges(badge("Paused", "danger")) },
    ],
  },
  marketplace: {
    singularLabel: "app",
    searchPlaceholder: "Search app / integration / sync...",
    createLabel: "Create App",
    columns: [
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "price", label: "Sync", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "APP-2101", name: "Beauty ERP Connector", type: "Operations", price: "2 min ago", status: toggle(true), permissions: badges(badge("Connected", "success")) },
      { id: "APP-2102", name: "Email Studio", type: "Marketing", price: "5 min ago", status: toggle(true), permissions: badges(badge("Connected", "success")) },
      { id: "APP-2103", name: "Warehouse Bridge", type: "Inventory", price: "14 min ago", status: toggle(false), permissions: badges(badge("Delayed", "warning")) },
      { id: "APP-2104", name: "Beauty Analytics Exporter", type: "Reporting", price: "1 min ago", status: toggle(true), permissions: badges(badge("Connected", "success")) },
      { id: "APP-2105", name: "Loyalty API", type: "Retention", price: "Offline", status: toggle(false), permissions: badges(badge("Disconnected", "danger")) },
    ],
  },
  settings: {
    singularLabel: "setting",
    searchPlaceholder: "Search setting / checkout / storefront...",
    createLabel: "Create Setting",
    columns: [
      { key: "name", label: "Name" },
      { key: "area", label: "Area" },
      { key: "price", label: "Updated", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "SET-2201", name: "Beauty Checkout Currency", area: "Payments", price: "08:10", status: toggle(true), permissions: badges(badge("Live", "success")) },
      { id: "SET-2202", name: "Tax Calculation", area: "Compliance", price: "16:30", status: toggle(true), permissions: badges(badge("Live", "success")) },
      { id: "SET-2203", name: "Shade Variant Limits", area: "Catalog", price: "10:12", status: toggle(false), permissions: badges(badge("Review", "warning")) },
      { id: "SET-2204", name: "Store Hours", area: "Operations", price: "09:48", status: toggle(true), permissions: badges(badge("Draft", "neutral")) },
      { id: "SET-2205", name: "Webhook Retries", area: "Integrations", price: "13:22", status: toggle(true), permissions: badges(badge("Live", "success")) },
    ],
  },
  notifications: {
    singularLabel: "notification rule",
    searchPlaceholder: "Search alert / trigger / audience...",
    createLabel: "Create Notification",
    columns: [
      { key: "name", label: "Name" },
      { key: "channel", label: "Channel" },
      { key: "price", label: "Schedule", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "NTF-2301", name: "Order Shipped", channel: "Email", price: "Instant", status: toggle(true), permissions: badges(badge("Enabled", "success")) },
      { id: "NTF-2302", name: "Low Stock On Serum", channel: "Slack", price: "Instant", status: toggle(true), permissions: badges(badge("Enabled", "success")) },
      { id: "NTF-2303", name: "Refund Processed", channel: "Email", price: "Instant", status: toggle(false), permissions: badges(badge("Paused", "warning")) },
      { id: "NTF-2304", name: "Campaign Summary", channel: "Email", price: "09:00 Daily", status: toggle(true), permissions: badges(badge("Enabled", "success")) },
      { id: "NTF-2305", name: "Fraud Signal", channel: "SMS", price: "Instant", status: toggle(false), permissions: badges(badge("Failed", "danger")) },
    ],
  },
  logs: {
    singularLabel: "log entry",
    searchPlaceholder: "Search service / issue / health...",
    createLabel: "Create Log",
    columns: [
      { key: "name", label: "Name" },
      { key: "service", label: "Service" },
      { key: "price", label: "Time", align: "right" },
      { key: "status", label: "Status" },
      { key: "permissions", label: "Permissions" },
    ],
    rows: [
      { id: "LOG-2401", name: "Payment capture completed", service: "Checkout API", price: "09:18", status: toggle(true), permissions: badges(badge("Healthy", "success")) },
      { id: "LOG-2402", name: "Inventory lag on serum", service: "Inventory Sync", price: "09:06", status: toggle(false), permissions: badges(badge("Investigate", "warning")) },
      { id: "LOG-2403", name: "Launch email batch sent", service: "Email Worker", price: "08:58", status: toggle(true), permissions: badges(badge("Healthy", "success")) },
      { id: "LOG-2404", name: "Fraud rules timeout", service: "Risk Engine", price: "08:31", status: toggle(false), permissions: badges(badge("Open Incident", "danger")) },
      { id: "LOG-2405", name: "Nightly export done", service: "Reports Service", price: "07:45", status: toggle(true), permissions: badges(badge("Healthy", "success")) },
    ],
  },
};
