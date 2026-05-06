import { fakeModuleDefinitions } from "@/pages/dashboard/common/moduleFakeData";
import { readOrderRecords } from "@/pages/dashboard/orders/orderData";
import { readProductRecords } from "@/pages/dashboard/products/productData";

export type CustomerRecord = Readonly<{
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  segment: string;
  beautyConcern: string;
  status: string;
  verification: string;
  ltv: string;
  address: string;
  joinedAt: string;
  notes: string;
  orderIds: ReadonlyArray<string>;
  wishlistProductIds: ReadonlyArray<string>;
}>;

const seededCustomers: ReadonlyArray<CustomerRecord> = [
  {
    id: "CUS-2001",
    name: "Olivia Johnson",
    email: "olivia@kanbeauty.com",
    phone: "+212 600 211 001",
    city: "Rabat",
    segment: "VIP",
    beautyConcern: "Brightening Routine",
    status: "Active",
    verification: "Verified",
    ltv: "Rs 2,480",
    address: "Souissi, Rabat, Morocco",
    joinedAt: "01/12/2024",
    notes: "High-value repeat customer with strong skincare purchase history.",
    orderIds: ["ORD-4001"],
    wishlistProductIds: ["PRD-3002", "PRD-3005"],
  },
  {
    id: "CUS-2002",
    name: "Liam Patel",
    email: "liam@kanbeauty.com",
    phone: "+212 600 211 002",
    city: "Rabat",
    segment: "Returning",
    beautyConcern: "Barrier Repair",
    status: "Active",
    verification: "Verified",
    ltv: "Rs 684",
    address: "Agdal, Rabat, Morocco",
    joinedAt: "15/01/2025",
    notes: "Prefers fast checkout and usually orders lip products.",
    orderIds: ["ORD-4002"],
    wishlistProductIds: ["PRD-3001", "PRD-3004"],
  },
  {
    id: "CUS-2003",
    name: "Isabella Chen",
    email: "isabella@kanbeauty.com",
    phone: "+212 600 211 003",
    city: "Casablanca",
    segment: "New",
    beautyConcern: "Daily SPF",
    status: "Guest",
    verification: "Pending",
    ltv: "Rs 148",
    address: "Maarif, Casablanca, Morocco",
    joinedAt: "20/03/2025",
    notes: "Recently signed up from a campaign landing page.",
    orderIds: [],
    wishlistProductIds: ["PRD-3001"],
  },
  {
    id: "CUS-2004",
    name: "Ethan Miller",
    email: "ethan@kanbeauty.com",
    phone: "+212 600 211 004",
    city: "Marrakesh",
    segment: "At Risk",
    beautyConcern: "Acne Control",
    status: "Needs Attention",
    verification: "Verified",
    ltv: "Rs 512",
    address: "Gueliz, Marrakesh, Morocco",
    joinedAt: "08/11/2024",
    notes: "Churn risk due to long purchase gap. Candidate for winback flow.",
    orderIds: ["ORD-4004"],
    wishlistProductIds: ["PRD-3003"],
  },
  {
    id: "CUS-2005",
    name: "Mia Garcia",
    email: "mia@kanbeauty.com",
    phone: "+212 600 211 005",
    city: "Tangier",
    segment: "Loyal",
    beautyConcern: "Lip And Cheek",
    status: "Active",
    verification: "Verified",
    ltv: "Rs 1,396",
    address: "Marshan, Tangier, Morocco",
    joinedAt: "19/09/2024",
    notes: "Buys from color cosmetics category almost every month.",
    orderIds: [],
    wishlistProductIds: ["PRD-3002", "PRD-3005"],
  },
];

const customerNameById = new Map(
  seededCustomers.map((customer) => [customer.id, customer.name.toLowerCase()])
);

const orderCustomerMappings: Readonly<Record<string, string>> = {
  "ORD-4001": "CUS-2001",
  "ORD-4002": "CUS-2002",
  "ORD-4003": "CUS-2005",
  "ORD-4004": "CUS-2004",
};

export const readCustomerRecords = (): ReadonlyArray<CustomerRecord> => {
  const seededIds = new Set(fakeModuleDefinitions.customers?.rows.map((row) => row.id) ?? []);
  const orders = readOrderRecords();

  return seededCustomers
    .filter((customer) => seededIds.size === 0 || seededIds.has(customer.id))
    .map((customer) => {
      const relatedOrderIds = orders
        .filter((order) => {
          const mappedCustomerId = orderCustomerMappings[order.id];
          if (mappedCustomerId) return mappedCustomerId === customer.id;
          return order.customerName.toLowerCase() === customerNameById.get(customer.id);
        })
        .map((order) => order.id);

      return {
        ...customer,
        orderIds: relatedOrderIds.length > 0 ? relatedOrderIds : customer.orderIds,
      };
    });
};

export const findCustomerRecord = (id: string) => readCustomerRecords().find((customer) => customer.id === id);

export const readCustomerOrders = (customerId: string) => {
  const customer = findCustomerRecord(customerId);
  if (!customer) return [];

  const orderIdSet = new Set(customer.orderIds);
  return readOrderRecords().filter((order) => orderIdSet.has(order.id));
};

export const readCustomerWishlistProducts = (customerId: string) => {
  const customer = findCustomerRecord(customerId);
  if (!customer) return [];

  const productIdSet = new Set(customer.wishlistProductIds);
  return readProductRecords().filter((product) => productIdSet.has(product.id));
};
