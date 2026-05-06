export type MissingModuleKey =
  | "categories"
  | "product-variants"
  | "product-attributes-tags"
  | "product-media"
  | "advertisements"
  | "carts"
  | "wishlists"
  | "payments"
  | "coupons"
  | "delivery"
  | "reviews"
  | "faqs"
  | "product-inquiries"
  | "contacts"
  | "site-inquiries"
  | "blog-posts"
  | "seo-metadata"
  | "newsletter"
  | "web-push-subscriptions"
  | "web-push-notifications"
  | "email-campaigns"
  | "activity-logs"
  | "audit-logs";

export type MissingModuleRow = Readonly<{
  id: string;
  title: string;
  subtitle: string;
  columns: Readonly<Record<string, string>>;
  chips?: ReadonlyArray<Readonly<{ label: string; tone: "info" | "success" | "warning" | "danger" }>>;
  details: ReadonlyArray<Readonly<{ label: string; value: string }>>;
  timeline?: ReadonlyArray<string>;
}>;

export type MissingModuleDefinition = Readonly<{
  key: MissingModuleKey;
  title: string;
  description: string;
  routeBase: string;
  columns: ReadonlyArray<Readonly<{ key: string; label: string; align?: "left" | "right" }>>;
  rows: ReadonlyArray<MissingModuleRow>;
}>;

const createDefinition = ({
  key,
  title,
  description,
  routeBase,
  columns,
  rows,
}: MissingModuleDefinition): MissingModuleDefinition => ({
  key,
  title,
  description,
  routeBase,
  columns,
  rows,
});

export const missingModulesMap: Readonly<Record<MissingModuleKey, MissingModuleDefinition>> = {
  categories: createDefinition({
    key: "categories",
    title: "Categories",
    description: "Category and subcategory structure with slug visibility for the cosmetics catalog.",
    routeBase: "/dashboard/categories",
    columns: [
      { key: "name", label: "Category" },
      { key: "subcategoryCount", label: "Subcategories", align: "right" },
      { key: "productCount", label: "Products", align: "right" },
      { key: "slug", label: "Slug" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "CAT-1001",
        title: "Face",
        subtitle: "Complexion and base products",
        columns: { name: "Face", subcategoryCount: "5", productCount: "18", slug: "face", status: "active" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "Description", value: "Foundation, compact powder, primer, concealer, and cushion coverage lines." },
          { label: "Main Tables", value: "categories, subcategories" },
          { label: "Soft Delete", value: "Visible in archived state when is_deleted is true." },
        ],
      },
      {
        id: "CAT-1002",
        title: "Lips",
        subtitle: "Lip color and finish ranges",
        columns: { name: "Lips", subcategoryCount: "4", productCount: "12", slug: "lips", status: "active" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "Description", value: "Liquid lipstick, matte lipstick, PH lipstick, and gloss-adjacent products." },
          { label: "Main Tables", value: "categories, subcategories" },
          { label: "Soft Delete", value: "Visible in archived state when is_deleted is true." },
        ],
      },
    ],
  }),
  "product-variants": createDefinition({
    key: "product-variants",
    title: "Product Variants",
    description: "Variant-aware catalog records with parent product context, pricing, and default variant visibility.",
    routeBase: "/dashboard/product-variants",
    columns: [
      { key: "variant", label: "Variant" },
      { key: "product", label: "Product" },
      { key: "price", label: "Price", align: "right" },
      { key: "stock", label: "Stock", align: "right" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "VAR-2001",
        title: "Rose Nude",
        subtitle: "Default shade for KAN Liquid Lipstick",
        columns: { variant: "Rose Nude", product: "KAN Liquid Lipstick", price: "Rs 1,499", stock: "24", status: "default" },
        chips: [{ label: "default", tone: "info" }, { label: "active", tone: "success" }],
        details: [
          { label: "Variant SKU", value: "KAN-LIP-001-RN" },
          { label: "Parent Product", value: "KAN Liquid Lipstick" },
          { label: "Variant Pricing", value: "MRP Rs 1,800 / Sale Rs 1,499" },
        ],
      },
      {
        id: "VAR-2002",
        title: "Cherry Red",
        subtitle: "Secondary shade for KAN Liquid Lipstick",
        columns: { variant: "Cherry Red", product: "KAN Liquid Lipstick", price: "Rs 1,499", stock: "7", status: "low stock" },
        chips: [{ label: "low stock", tone: "warning" }],
        details: [
          { label: "Variant SKU", value: "KAN-LIP-001-CR" },
          { label: "Parent Product", value: "KAN Liquid Lipstick" },
          { label: "Variant Pricing", value: "MRP Rs 1,800 / Sale Rs 1,499" },
        ],
      },
    ],
  }),
  "product-attributes-tags": createDefinition({
    key: "product-attributes-tags",
    title: "Product Attributes And Tags",
    description: "Attribute key-value records and merchandising tags for cosmetics products.",
    routeBase: "/dashboard/product-attributes-tags",
    columns: [
      { key: "product", label: "Product" },
      { key: "attributeSet", label: "Attributes" },
      { key: "tags", label: "Tags" },
      { key: "updatedAt", label: "Updated" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "PAT-2101",
        title: "KAN Compact Powder",
        subtitle: "Skin type and finish mapped for quick filtering",
        columns: { product: "KAN Compact Powder", attributeSet: "finish, skin_type, coverage", tags: "matte, oil-control", updatedAt: "Today", status: "active" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "Attributes", value: "finish=matte, skin_type=oily, coverage=medium" },
          { label: "Tags", value: "matte, oil-control" },
          { label: "Main Tables", value: "product_attributes, product_tags" },
        ],
      },
      {
        id: "PAT-2102",
        title: "KAN Liquid Lipstick",
        subtitle: "Shade and finish tags maintained together",
        columns: { product: "KAN Liquid Lipstick", attributeSet: "finish, wear_time, shade_family", tags: "matte, nude", updatedAt: "Yesterday", status: "active" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "Attributes", value: "finish=matte, wear_time=longwear, shade_family=nude" },
          { label: "Tags", value: "matte, nude" },
          { label: "Main Tables", value: "product_attributes, product_tags" },
        ],
      },
    ],
  }),
  "product-media": createDefinition({
    key: "product-media",
    title: "Product Media",
    description: "Product-specific gallery records for cover, hover, and supporting visuals.",
    routeBase: "/dashboard/product-media",
    columns: [
      { key: "product", label: "Product" },
      { key: "assetCount", label: "Assets", align: "right" },
      { key: "cover", label: "Cover" },
      { key: "hover", label: "Hover" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "MED-2201",
        title: "KAN Liquid Lipstick",
        subtitle: "Primary ecommerce gallery set",
        columns: { product: "KAN Liquid Lipstick", assetCount: "6", cover: "assigned", hover: "assigned", status: "active" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "Media Assets", value: "Cover, hover, shade closeups, texture swatch" },
          { label: "Main Tables", value: "media_assets" },
          { label: "Preview", value: "Hover image available in table and detail views." },
        ],
      },
      {
        id: "MED-2202",
        title: "KAN Compact Powder",
        subtitle: "Cover image live, hover image pending refresh",
        columns: { product: "KAN Compact Powder", assetCount: "4", cover: "assigned", hover: "pending", status: "draft" },
        chips: [{ label: "draft", tone: "warning" }],
        details: [
          { label: "Media Assets", value: "Cover, packshot, texture detail" },
          { label: "Main Tables", value: "media_assets" },
          { label: "Preview", value: "Hover image upload still pending." },
        ],
      },
    ],
  }),
  advertisements: createDefinition({
    key: "advertisements",
    title: "Advertisements",
    description: "Ad slot management by product, category, and subcategory target.",
    routeBase: "/dashboard/advertisements",
    columns: [
      { key: "slot", label: "Slot" },
      { key: "targetType", label: "Target Type" },
      { key: "target", label: "Target" },
      { key: "window", label: "Active Window" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "ADV-2301",
        title: "Homepage Hero",
        subtitle: "Launch slot for seasonal lipstick push",
        columns: { slot: "Homepage Hero", targetType: "product", target: "KAN Liquid Lipstick", window: "May 1 - May 31", status: "active" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "Target Mapping", value: "product -> KAN Liquid Lipstick" },
          { label: "Main Tables", value: "advertisements" },
          { label: "Placement", value: "Homepage top hero carousel" },
        ],
      },
      {
        id: "ADV-2302",
        title: "Category Rail",
        subtitle: "Hair category support banner",
        columns: { slot: "Category Rail", targetType: "category", target: "Hair", window: "May 10 - Jun 10", status: "scheduled" },
        chips: [{ label: "scheduled", tone: "info" }],
        details: [
          { label: "Target Mapping", value: "category -> Hair" },
          { label: "Main Tables", value: "advertisements" },
          { label: "Placement", value: "Category landing banner row" },
        ],
      },
    ],
  }),
  carts: createDefinition({
    key: "carts",
    title: "Carts",
    description: "Active and abandoned cart monitoring with customer and line-item context.",
    routeBase: "/dashboard/carts",
    columns: [
      { key: "customer", label: "Customer" },
      { key: "cartType", label: "Cart Type" },
      { key: "items", label: "Items", align: "right" },
      { key: "value", label: "Value", align: "right" },
      { key: "updatedAt", label: "Updated" },
    ],
    rows: [
      {
        id: "CRT-2401",
        title: "Olivia Johnson",
        subtitle: "2 variants waiting in cart",
        columns: { customer: "Olivia Johnson", cartType: "active", items: "2", value: "Rs 2,998", updatedAt: "12m ago" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "Variant Context", value: "KAN Liquid Lipstick / Rose Nude x1, Cherry Red x1" },
          { label: "Main Tables", value: "carts, cart_items, customers" },
          { label: "Customer Link", value: "Customer record should remain linked from cart." },
        ],
      },
      {
        id: "CRT-2402",
        title: "Liam Patel",
        subtitle: "Abandoned cart pending recovery",
        columns: { customer: "Liam Patel", cartType: "abandoned", items: "3", value: "Rs 5,200", updatedAt: "18h ago" },
        chips: [{ label: "abandoned", tone: "warning" }],
        details: [
          { label: "Variant Context", value: "Compact Powder, Primer, Setting Spray" },
          { label: "Main Tables", value: "carts, cart_items, customers" },
          { label: "Recovery State", value: "Eligible for email reminder flow." },
        ],
      },
    ],
  }),
  wishlists: createDefinition({
    key: "wishlists",
    title: "Wishlists",
    description: "Wishlist viewing by customer with product and variant mapping.",
    routeBase: "/dashboard/wishlists",
    columns: [
      { key: "customer", label: "Customer" },
      { key: "product", label: "Product" },
      { key: "variant", label: "Variant" },
      { key: "createdAt", label: "Saved" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "WIS-2501",
        title: "Savannah Nguyen",
        subtitle: "Wishlist contains complexion and lip favorites",
        columns: { customer: "Savannah Nguyen", product: "KAN Liquid Lipstick", variant: "Rose Nude", createdAt: "2d ago", status: "active" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "Customer Link", value: "Customer profile remains linked from wishlist view." },
          { label: "Main Tables", value: "wishlists" },
          { label: "Variant Awareness", value: "Product and variant context stored together." },
        ],
      },
      {
        id: "WIS-2502",
        title: "Noah Brown",
        subtitle: "Interest in powder product restock",
        columns: { customer: "Noah Brown", product: "KAN Compact Powder", variant: "Natural Beige", createdAt: "4d ago", status: "active" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "Customer Link", value: "Customer profile remains linked from wishlist view." },
          { label: "Main Tables", value: "wishlists" },
          { label: "Variant Awareness", value: "Natural Beige shade saved to wishlist." },
        ],
      },
    ],
  }),
  payments: createDefinition({
    key: "payments",
    title: "Payments",
    description: "Payment tracking with status filters, methods, and transaction lookup.",
    routeBase: "/dashboard/payments",
    columns: [
      { key: "order", label: "Order" },
      { key: "customer", label: "Customer" },
      { key: "method", label: "Method" },
      { key: "amount", label: "Amount", align: "right" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "PAY-2601",
        title: "Payment #2601",
        subtitle: "Captured card payment for order #10482",
        columns: { order: "#10482", customer: "Savannah Nguyen", method: "card", amount: "Rs 2,998", status: "paid" },
        chips: [{ label: "paid", tone: "success" }],
        details: [
          { label: "Transaction Ref", value: "txn_88214_capture" },
          { label: "Main Tables", value: "payments" },
          { label: "Payment Method", value: "Card gateway capture successful." },
        ],
      },
      {
        id: "PAY-2602",
        title: "Payment #2602",
        subtitle: "COD payment still pending settlement",
        columns: { order: "#10481", customer: "Jerome Bell", method: "cash on delivery", amount: "Rs 1,499", status: "pending" },
        chips: [{ label: "pending", tone: "warning" }],
        details: [
          { label: "Transaction Ref", value: "cod_order_10481" },
          { label: "Main Tables", value: "payments" },
          { label: "Payment Method", value: "Awaiting courier settlement confirmation." },
        ],
      },
    ],
  }),
  coupons: createDefinition({
    key: "coupons",
    title: "Coupons",
    description: "Coupon CRUD, activation windows, and usage tracking.",
    routeBase: "/dashboard/coupons",
    columns: [
      { key: "code", label: "Code" },
      { key: "discount", label: "Discount" },
      { key: "window", label: "Window" },
      { key: "usage", label: "Usage", align: "right" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "CPN-2701",
        title: "LIP15",
        subtitle: "Lip category campaign coupon",
        columns: { code: "LIP15", discount: "15% off", window: "May 1 - May 20", usage: "82", status: "active" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "Usage Tracking", value: "82 redemptions across 71 customers" },
          { label: "Main Tables", value: "coupons, coupon_usages" },
          { label: "Target Scope", value: "Lip catalog promotion" },
        ],
      },
      {
        id: "CPN-2702",
        title: "FACEBUNDLE",
        subtitle: "Starter routine promotion",
        columns: { code: "FACEBUNDLE", discount: "Rs 500 off", window: "May 8 - Jun 8", usage: "14", status: "scheduled" },
        chips: [{ label: "scheduled", tone: "info" }],
        details: [
          { label: "Usage Tracking", value: "Launch window not open yet" },
          { label: "Main Tables", value: "coupons, coupon_usages" },
          { label: "Target Scope", value: "Starter complexion bundle" },
        ],
      },
    ],
  }),
  delivery: createDefinition({
    key: "delivery",
    title: "Delivery",
    description: "Courier and shipment monitoring with timelines, partner references, pickup requests, and API log context.",
    routeBase: "/dashboard/delivery/shipments",
    columns: [
      { key: "shipment", label: "Shipment" },
      { key: "courier", label: "Courier" },
      { key: "partnerRef", label: "Partner Ref" },
      { key: "city", label: "City" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "SHP-3001",
        title: "Shipment #3001",
        subtitle: "Order #10482 for Savannah Nguyen",
        columns: { shipment: "Shipment #3001", courier: "Aramex", partnerRef: "ARX-88214", city: "Rabat", status: "delivered" },
        chips: [{ label: "delivered", tone: "success" }],
        details: [
          { label: "Pickup Address", value: "KAN Warehouse A" },
          { label: "Webhook Event", value: "delivered webhook received successfully" },
          { label: "API Logs", value: "2 successful sync entries" },
        ],
        timeline: ["Shipment created", "Picked up by courier", "Out for delivery", "Delivered to customer"],
      },
      {
        id: "SHP-3002",
        title: "Shipment #3002",
        subtitle: "Order #10481 for Jerome Bell",
        columns: { shipment: "Shipment #3002", courier: "DHL", partnerRef: "DHL-11822", city: "Rabat", status: "queued" },
        chips: [{ label: "queued", tone: "warning" }],
        details: [
          { label: "Pickup Address", value: "KAN Warehouse A" },
          { label: "Webhook Event", value: "awaiting pickup confirmation" },
          { label: "API Logs", value: "1 queued request pending courier acknowledgement" },
        ],
        timeline: ["Shipment created", "Pickup request queued"],
      },
    ],
  }),
  reviews: createDefinition({
    key: "reviews",
    title: "Reviews",
    description: "Product and site review moderation with publish state visibility.",
    routeBase: "/dashboard/reviews",
    columns: [
      { key: "reviewer", label: "Reviewer" },
      { key: "target", label: "Target" },
      { key: "type", label: "Type" },
      { key: "rating", label: "Rating", align: "right" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "REV-3101",
        title: "Ava Khan",
        subtitle: "Positive product review awaiting publication",
        columns: { reviewer: "Ava Khan", target: "KAN Liquid Lipstick", type: "product", rating: "5/5", status: "pending" },
        chips: [{ label: "pending", tone: "warning" }],
        details: [
          { label: "Moderation", value: "Ready for publish after copy review" },
          { label: "Main Tables", value: "reviews" },
          { label: "Split", value: "Product review" },
        ],
      },
      {
        id: "REV-3102",
        title: "Mia Garcia",
        subtitle: "Published site review for support quality",
        columns: { reviewer: "Mia Garcia", target: "Site Experience", type: "site", rating: "4/5", status: "published" },
        chips: [{ label: "published", tone: "success" }],
        details: [
          { label: "Moderation", value: "Visible on site testimonial surface" },
          { label: "Main Tables", value: "reviews" },
          { label: "Split", value: "Site review" },
        ],
      },
    ],
  }),
  faqs: createDefinition({
    key: "faqs",
    title: "FAQs",
    description: "Product and site FAQ management with active toggle visibility.",
    routeBase: "/dashboard/faqs",
    columns: [
      { key: "question", label: "Question" },
      { key: "scope", label: "Scope" },
      { key: "target", label: "Target" },
      { key: "updatedAt", label: "Updated" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "FAQ-3201",
        title: "Is this lipstick transfer-proof?",
        subtitle: "Common product-level purchase question",
        columns: { question: "Is this lipstick transfer-proof?", scope: "product", target: "KAN Liquid Lipstick", updatedAt: "Today", status: "active" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "FAQ Split", value: "Product FAQ" },
          { label: "Main Tables", value: "faqs" },
          { label: "Active Toggle", value: "Visible on PDP" },
        ],
      },
      {
        id: "FAQ-3202",
        title: "How long does delivery take?",
        subtitle: "Common site-level support question",
        columns: { question: "How long does delivery take?", scope: "site", target: "Checkout", updatedAt: "Yesterday", status: "active" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "FAQ Split", value: "Site FAQ" },
          { label: "Main Tables", value: "faqs" },
          { label: "Active Toggle", value: "Visible on help center" },
        ],
      },
    ],
  }),
  "product-inquiries": createDefinition({
    key: "product-inquiries",
    title: "Product Inquiries",
    description: "Inbox for product-specific questions with handled flags, customer context, and reply thread visibility.",
    routeBase: "/dashboard/support/product-inquiries",
    columns: [
      { key: "subject", label: "Subject" },
      { key: "product", label: "Product" },
      { key: "customer", label: "Customer" },
      { key: "status", label: "Status" },
      { key: "updatedAt", label: "Updated" },
    ],
    rows: [
      {
        id: "INQ-4001",
        title: "Shade compatibility question",
        subtitle: "Customer asked about olive undertones",
        columns: { subject: "Shade compatibility question", product: "KAN Liquid Lipstick", customer: "Olivia Johnson", status: "unhandled", updatedAt: "2h ago" },
        chips: [{ label: "unhandled", tone: "warning" }],
        details: [
          { label: "Reply Thread", value: "No reply sent yet" },
          { label: "Variant Context", value: "Rose Nude and Cherry Red compared in same thread" },
          { label: "Main Tables", value: "inquiries, replies" },
        ],
        timeline: ["Inquiry received from PDP", "Marked unread"],
      },
      {
        id: "INQ-4002",
        title: "Ingredient clarification",
        subtitle: "Question about fragrance sensitivity",
        columns: { subject: "Ingredient clarification", product: "KAN Compact Powder", customer: "Liam Patel", status: "handled", updatedAt: "6h ago" },
        chips: [{ label: "handled", tone: "success" }],
        details: [
          { label: "Reply Thread", value: "Ingredient summary shared with customer" },
          { label: "Variant Context", value: "Face category product without shade dependency" },
          { label: "Main Tables", value: "inquiries, replies" },
        ],
        timeline: ["Inquiry received", "Reply sent", "Handled flag updated"],
      },
    ],
  }),
  contacts: createDefinition({
    key: "contacts",
    title: "Contacts",
    description: "General contact inbox with view state, handled state, and reply workflow through support responses.",
    routeBase: "/dashboard/support/contacts",
    columns: [
      { key: "name", label: "Contact" },
      { key: "topic", label: "Topic" },
      { key: "email", label: "Email" },
      { key: "status", label: "Status" },
      { key: "updatedAt", label: "Updated" },
    ],
    rows: [
      {
        id: "CON-5001",
        title: "Wholesale interest",
        subtitle: "Salon owner wants distributor pricing",
        columns: { name: "Mia Garcia", topic: "Wholesale", email: "mia@salonpro.com", status: "unhandled", updatedAt: "1h ago" },
        chips: [{ label: "unhandled", tone: "warning" }],
        details: [
          { label: "Reply Thread", value: "No reply yet" },
          { label: "Handled State", value: "Will switch through replies workflow" },
          { label: "Main Tables", value: "contacts, replies" },
        ],
        timeline: ["Contact message received", "Unread state in inbox"],
      },
      {
        id: "CON-5002",
        title: "Refund follow-up",
        subtitle: "Customer requested refund status update",
        columns: { name: "Ethan Miller", topic: "Refund", email: "ethan@kanbeauty.com", status: "handled", updatedAt: "4h ago" },
        chips: [{ label: "handled", tone: "success" }],
        details: [
          { label: "Reply Thread", value: "Support confirmed refund processing status" },
          { label: "Handled State", value: "Closed after reply" },
          { label: "Main Tables", value: "contacts, replies" },
        ],
        timeline: ["Contact received", "Reply sent", "Handled state updated"],
      },
    ],
  }),
  "site-inquiries": createDefinition({
    key: "site-inquiries",
    title: "Site Inquiries",
    description: "AI digital hair color and site-level inquiry inbox with type filters, admin note support, and idempotency visibility.",
    routeBase: "/dashboard/support/site-inquiries",
    columns: [
      { key: "name", label: "Inquiry" },
      { key: "type", label: "Type" },
      { key: "idempotencyKey", label: "Idempotency Key" },
      { key: "status", label: "Status" },
      { key: "updatedAt", label: "Updated" },
    ],
    rows: [
      {
        id: "STI-6001",
        title: "AI Hair Color Match",
        subtitle: "Photo-based hair shade recommendation request",
        columns: { name: "Ava Khan", type: "hair_color", idempotencyKey: "ik_hair_8821", status: "queued", updatedAt: "45m ago" },
        chips: [{ label: "queued", tone: "warning" }, { label: "idempotent", tone: "info" }],
        details: [
          { label: "Admin Note", value: "Awaiting manual review of uploaded photos" },
          { label: "Reply Thread", value: "No reply sent yet" },
          { label: "Main Tables", value: "site_inquiries, replies" },
        ],
        timeline: ["Inquiry submitted", "Idempotency key recorded", "Awaiting staff review"],
      },
      {
        id: "STI-6002",
        title: "Routine recommendation",
        subtitle: "General site inquiry for cosmetics bundle advice",
        columns: { name: "Noah Brown", type: "routine", idempotencyKey: "ik_site_1182", status: "handled", updatedAt: "3h ago" },
        chips: [{ label: "handled", tone: "success" }, { label: "idempotent", tone: "info" }],
        details: [
          { label: "Admin Note", value: "Recommended face + lip starter bundle" },
          { label: "Reply Thread", value: "Recommendation sent and acknowledged" },
          { label: "Main Tables", value: "site_inquiries, replies" },
        ],
        timeline: ["Inquiry submitted", "Reply drafted", "Handled state updated"],
      },
    ],
  }),
  "blog-posts": createDefinition({
    key: "blog-posts",
    title: "Blog Posts",
    description: "Blog post publishing with status toggle and author context.",
    routeBase: "/dashboard/blog-posts",
    columns: [
      { key: "title", label: "Post" },
      { key: "author", label: "Author" },
      { key: "slug", label: "Slug" },
      { key: "updatedAt", label: "Updated" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "BLG-7001",
        title: "Summer Base Makeup Routine",
        subtitle: "Editorial content for complexion range",
        columns: { title: "Summer Base Makeup Routine", author: "Admin Team", slug: "summer-base-makeup-routine", updatedAt: "Today", status: "published" },
        chips: [{ label: "published", tone: "success" }],
        details: [
          { label: "Publish Toggle", value: "Live on content hub" },
          { label: "Main Tables", value: "blog_posts" },
          { label: "Target", value: "Content marketing" },
        ],
      },
      {
        id: "BLG-7002",
        title: "How To Choose The Right Lip Shade",
        subtitle: "Draft editorial for lip category education",
        columns: { title: "How To Choose The Right Lip Shade", author: "Content Editor", slug: "choose-right-lip-shade", updatedAt: "Yesterday", status: "draft" },
        chips: [{ label: "draft", tone: "warning" }],
        details: [
          { label: "Publish Toggle", value: "Still in draft review" },
          { label: "Main Tables", value: "blog_posts" },
          { label: "Target", value: "Category education" },
        ],
      },
    ],
  }),
  "seo-metadata": createDefinition({
    key: "seo-metadata",
    title: "SEO Metadata",
    description: "Entity-linked SEO records with slug targeting and indexing control.",
    routeBase: "/dashboard/seo-metadata",
    columns: [
      { key: "entityType", label: "Entity Type" },
      { key: "target", label: "Target" },
      { key: "slug", label: "Slug" },
      { key: "indexing", label: "Indexing" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "SEO-7101",
        title: "Liquid Lipstick Metadata",
        subtitle: "SEO record for hero lip product",
        columns: { entityType: "product", target: "KAN Liquid Lipstick", slug: "kan-liquid-lipstick", indexing: "index,follow", status: "active" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "Entity Mapping", value: "product -> KAN Liquid Lipstick" },
          { label: "Main Tables", value: "seo_metadata" },
          { label: "Targeting", value: "Slug and metadata pair active" },
        ],
      },
      {
        id: "SEO-7102",
        title: "Hair Category Metadata",
        subtitle: "SEO record for future hair shelf",
        columns: { entityType: "category", target: "Hair", slug: "hair", indexing: "noindex,follow", status: "draft" },
        chips: [{ label: "draft", tone: "warning" }],
        details: [
          { label: "Entity Mapping", value: "category -> Hair" },
          { label: "Main Tables", value: "seo_metadata" },
          { label: "Targeting", value: "Held back until category launch" },
        ],
      },
    ],
  }),
  newsletter: createDefinition({
    key: "newsletter",
    title: "Newsletter",
    description: "Subscriber registry with subscription state and simple segmentation.",
    routeBase: "/dashboard/newsletter",
    columns: [
      { key: "email", label: "Subscriber" },
      { key: "segment", label: "Segment" },
      { key: "source", label: "Source" },
      { key: "joinedAt", label: "Joined" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "NWS-7201",
        title: "olivia@example.com",
        subtitle: "Lip launches and offers segment",
        columns: { email: "olivia@example.com", segment: "lip lovers", source: "checkout", joinedAt: "3d ago", status: "subscribed" },
        chips: [{ label: "subscribed", tone: "success" }],
        details: [
          { label: "Subscription State", value: "Active subscriber" },
          { label: "Main Tables", value: "newsletters" },
          { label: "Segment", value: "lip lovers" },
        ],
      },
      {
        id: "NWS-7202",
        title: "liam@example.com",
        subtitle: "Complexion education list",
        columns: { email: "liam@example.com", segment: "face routine", source: "footer form", joinedAt: "7d ago", status: "unsubscribed" },
        chips: [{ label: "unsubscribed", tone: "danger" }],
        details: [
          { label: "Subscription State", value: "Inactive subscriber" },
          { label: "Main Tables", value: "newsletters" },
          { label: "Segment", value: "face routine" },
        ],
      },
    ],
  }),
  "web-push-subscriptions": createDefinition({
    key: "web-push-subscriptions",
    title: "Web Push Subscriptions",
    description: "Push subscription registry with platform and active/inactive state.",
    routeBase: "/dashboard/web-push-subscriptions",
    columns: [
      { key: "customer", label: "Customer" },
      { key: "platform", label: "Platform" },
      { key: "device", label: "Device" },
      { key: "subscribedAt", label: "Subscribed" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "WPS-7301",
        title: "Savannah Nguyen",
        subtitle: "iPhone Safari push registration",
        columns: { customer: "Savannah Nguyen", platform: "iOS", device: "Safari", subscribedAt: "2d ago", status: "active" },
        chips: [{ label: "active", tone: "success" }],
        details: [
          { label: "Platform View", value: "iOS / Safari" },
          { label: "Main Tables", value: "web_push_subscriptions" },
          { label: "Device State", value: "Receiving enabled" },
        ],
      },
      {
        id: "WPS-7302",
        title: "Noah Brown",
        subtitle: "Android Chrome push disabled",
        columns: { customer: "Noah Brown", platform: "Android", device: "Chrome", subscribedAt: "10d ago", status: "inactive" },
        chips: [{ label: "inactive", tone: "danger" }],
        details: [
          { label: "Platform View", value: "Android / Chrome" },
          { label: "Main Tables", value: "web_push_subscriptions" },
          { label: "Device State", value: "Push revoked by user" },
        ],
      },
    ],
  }),
  "web-push-notifications": createDefinition({
    key: "web-push-notifications",
    title: "Web Push Notifications",
    description: "Push delivery queue with status timeline and failure diagnostics.",
    routeBase: "/dashboard/web-push-notifications",
    columns: [
      { key: "campaign", label: "Notification" },
      { key: "audience", label: "Audience" },
      { key: "queuedAt", label: "Queued" },
      { key: "idempotencyKey", label: "Idempotency Key" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "WPN-7401",
        title: "Weekend Lip Drop",
        subtitle: "Promotional push for lip launch",
        columns: { campaign: "Weekend Lip Drop", audience: "2,180 subscribers", queuedAt: "30m ago", idempotencyKey: "wpn_88214", status: "sent" },
        chips: [{ label: "sent", tone: "success" }, { label: "idempotent", tone: "info" }],
        details: [
          { label: "Failure Diagnostics", value: "No failures recorded" },
          { label: "Main Tables", value: "web_push_notifications" },
          { label: "Delivery State", value: "Campaign dispatched successfully" },
        ],
        timeline: ["Notification queued", "Dispatch started", "Sent to subscribers"],
      },
      {
        id: "WPN-7402",
        title: "Restock Reminder",
        subtitle: "Compact powder restock notification",
        columns: { campaign: "Restock Reminder", audience: "420 subscribers", queuedAt: "2h ago", idempotencyKey: "wpn_11822", status: "failed" },
        chips: [{ label: "failed", tone: "danger" }, { label: "idempotent", tone: "info" }],
        details: [
          { label: "Failure Diagnostics", value: "Payload rejected for 18 expired subscriptions" },
          { label: "Main Tables", value: "web_push_notifications" },
          { label: "Delivery State", value: "Manual retry required" },
        ],
        timeline: ["Notification queued", "Dispatch started", "Failure recorded"],
      },
    ],
  }),
  "email-campaigns": createDefinition({
    key: "email-campaigns",
    title: "Email Campaigns",
    description: "Email campaign management with recipients, queues, and log visibility.",
    routeBase: "/dashboard/email-campaigns",
    columns: [
      { key: "campaign", label: "Campaign" },
      { key: "recipients", label: "Recipients", align: "right" },
      { key: "queueStatus", label: "Queue Status" },
      { key: "updatedAt", label: "Updated" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "EML-7501",
        title: "Mother's Day Beauty Edit",
        subtitle: "Segmented campaign for gift buyers",
        columns: { campaign: "Mother's Day Beauty Edit", recipients: "4,280", queueStatus: "processed", updatedAt: "Today", status: "sent" },
        chips: [{ label: "sent", tone: "success" }],
        details: [
          { label: "Mailing Tables", value: "email_campaigns, email_recipients, email_queues, email_logs" },
          { label: "Recipients", value: "4,280 targeted subscribers" },
          { label: "Queue State", value: "Queue completed successfully" },
        ],
      },
      {
        id: "EML-7502",
        title: "Abandoned Cart Recovery",
        subtitle: "Queued flow for abandoned checkout users",
        columns: { campaign: "Abandoned Cart Recovery", recipients: "124", queueStatus: "queued", updatedAt: "1h ago", status: "queued" },
        chips: [{ label: "queued", tone: "warning" }],
        details: [
          { label: "Mailing Tables", value: "email_campaigns, email_recipients, email_queues, email_logs" },
          { label: "Recipients", value: "124 cart recovery contacts" },
          { label: "Queue State", value: "Waiting for scheduler run" },
        ],
      },
    ],
  }),
  "activity-logs": createDefinition({
    key: "activity-logs",
    title: "Activity Logs",
    description: "User and customer activity timeline with operational filters.",
    routeBase: "/dashboard/activity-logs",
    columns: [
      { key: "actor", label: "Actor" },
      { key: "event", label: "Event" },
      { key: "context", label: "Context" },
      { key: "createdAt", label: "Created" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "ACT-7601",
        title: "Admin / Priya Shah",
        subtitle: "Updated product pricing and publish status",
        columns: { actor: "Priya Shah", event: "product.updated", context: "KAN Compact Powder", createdAt: "14m ago", status: "logged" },
        chips: [{ label: "logged", tone: "info" }],
        details: [
          { label: "Activity Tables", value: "user_activities, user_metadata" },
          { label: "Actor Type", value: "admin" },
          { label: "Timeline", value: "Suitable for chronological monitoring view" },
        ],
        timeline: ["Price field updated", "Publish toggle confirmed", "Activity log stored"],
      },
      {
        id: "ACT-7602",
        title: "Customer / Olivia Johnson",
        subtitle: "Added variant to cart after PDP visit",
        columns: { actor: "Olivia Johnson", event: "cart.item_added", context: "KAN Liquid Lipstick / Rose Nude", createdAt: "28m ago", status: "logged" },
        chips: [{ label: "logged", tone: "info" }],
        details: [
          { label: "Activity Tables", value: "user_activities, user_metadata" },
          { label: "Actor Type", value: "customer" },
          { label: "Timeline", value: "Suitable for chronological monitoring view" },
        ],
        timeline: ["Viewed product", "Selected variant", "Added to cart"],
      },
    ],
  }),
  "audit-logs": createDefinition({
    key: "audit-logs",
    title: "Audit Logs",
    description: "Entity-level admin change trail with actor and timeline visibility.",
    routeBase: "/dashboard/audit-logs",
    columns: [
      { key: "entity", label: "Entity" },
      { key: "action", label: "Action" },
      { key: "actor", label: "Actor" },
      { key: "createdAt", label: "Created" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        id: "AUD-7701",
        title: "Product / KAN Liquid Lipstick",
        subtitle: "Admin updated sale price",
        columns: { entity: "products", action: "updated", actor: "Priya Shah", createdAt: "18m ago", status: "recorded" },
        chips: [{ label: "recorded", tone: "info" }],
        details: [
          { label: "Audit Tables", value: "audit_logs" },
          { label: "Changed Fields", value: "sale_price, updated_at" },
          { label: "Entity Trail", value: "Product change linked to admin actor" },
        ],
        timeline: ["Entity loaded", "Price changed", "Audit trail persisted"],
      },
      {
        id: "AUD-7702",
        title: "Coupon / LIP15",
        subtitle: "Admin paused campaign redemption",
        columns: { entity: "coupons", action: "updated", actor: "Aarav Singh", createdAt: "1h ago", status: "recorded" },
        chips: [{ label: "recorded", tone: "info" }],
        details: [
          { label: "Audit Tables", value: "audit_logs" },
          { label: "Changed Fields", value: "is_active, updated_at" },
          { label: "Entity Trail", value: "Coupon change linked to admin actor" },
        ],
        timeline: ["Coupon loaded", "Status changed", "Audit trail persisted"],
      },
    ],
  }),
};
