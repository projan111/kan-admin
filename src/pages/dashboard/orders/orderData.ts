import { fakeModuleDefinitions } from "@/pages/dashboard/common/moduleFakeData";
import { readStoredOrderStatuses, type OrderStatus } from "./orderStore";

export type OrderItem = Readonly<{
  name: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  image: string;
}>;

export type OrderRecord = Readonly<{
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  city: string;
  paymentMethod: string;
  paymentStatus: string;
  total: string;
  placedAt: string;
  shippingAddress: string;
  notes: string;
  items: ReadonlyArray<OrderItem>;
  status: OrderStatus;
}>;

const orderImages: Readonly<Record<string, string>> = {
  "Radiance Vitamin C Serum": "/KAN WEBSITE/KAN PRODUCTS/foundation 1.png",
  "Velvet Matte Lip Kit": "/KAN WEBSITE/KAN PRODUCTS/liquid lipstick.png",
  "Botanical Cleansing Balm": "/KAN WEBSITE/KAN PRODUCTS/Wet-wipe Professional.png",
  "Silk Repair Shampoo": "/KAN WEBSITE/KAN PRODUCTS/setting spray.png",
  "Dewdrop Gel Cream": "/KAN WEBSITE/KAN PRODUCTS/cc air cushion-02.png",
};

const baseOrderRecords: ReadonlyArray<OrderRecord> = [
  {
    id: "ORD-4001",
    orderNumber: "#10482",
    customerName: "Savannah Nguyen",
    customerEmail: "savannah@kanbeauty.com",
    phone: "+212 600 111 222",
    city: "Rabat",
    paymentMethod: "Card",
    paymentStatus: "Paid",
    total: "Rs 48",
    placedAt: "07/05/2025 10:24 AM",
    shippingAddress: "Avenue Hassan II, Rabat, Morocco",
    notes: "Deliver between 10 AM and 2 PM if possible.",
    items: [
      {
        name: "Radiance Vitamin C Serum",
        sku: "BEA-VC-101",
        quantity: 1,
        unitPrice: "Rs 48",
        image: orderImages["Radiance Vitamin C Serum"],
      },
    ],
    status: "Delivered",
  },
  {
    id: "ORD-4002",
    orderNumber: "#10481",
    customerName: "Jerome Bell",
    customerEmail: "jerome@kanbeauty.com",
    phone: "+212 600 111 223",
    city: "Rabat",
    paymentMethod: "Cash On Delivery",
    paymentStatus: "Pending",
    total: "Rs 36",
    placedAt: "07/05/2025 09:10 AM",
    shippingAddress: "Agdal District, Rabat, Morocco",
    notes: "Customer requested phone confirmation before dispatch.",
    items: [
      {
        name: "Velvet Matte Lip Kit",
        sku: "BEA-LP-202",
        quantity: 1,
        unitPrice: "Rs 36",
        image: orderImages["Velvet Matte Lip Kit"],
      },
    ],
    status: "Pending",
  },
  {
    id: "ORD-4003",
    orderNumber: "#10480",
    customerName: "Darlene Robertson",
    customerEmail: "darlene@kanbeauty.com",
    phone: "+212 600 111 224",
    city: "Casablanca",
    paymentMethod: "Card",
    paymentStatus: "Paid",
    total: "Rs 42",
    placedAt: "07/05/2025 08:45 AM",
    shippingAddress: "Maarif Extension, Casablanca, Morocco",
    notes: "Gift message added to parcel.",
    items: [
      {
        name: "Botanical Cleansing Balm",
        sku: "BEA-CL-303",
        quantity: 1,
        unitPrice: "Rs 42",
        image: orderImages["Botanical Cleansing Balm"],
      },
    ],
    status: "Packed",
  },
  {
    id: "ORD-4004",
    orderNumber: "#10479",
    customerName: "Cody Fisher",
    customerEmail: "cody@kanbeauty.com",
    phone: "+212 600 111 225",
    city: "Marrakesh",
    paymentMethod: "Card",
    paymentStatus: "Paid",
    total: "Rs 80",
    placedAt: "07/05/2025 08:02 AM",
    shippingAddress: "Gueliz, Marrakesh, Morocco",
    notes: "Bundle order with fragile packing instruction.",
    items: [
      {
        name: "Silk Repair Shampoo",
        sku: "BEA-HA-404",
        quantity: 1,
        unitPrice: "Rs 28",
        image: orderImages["Silk Repair Shampoo"],
      },
      {
        name: "Dewdrop Gel Cream",
        sku: "BEA-MO-505",
        quantity: 1,
        unitPrice: "Rs 52",
        image: orderImages["Dewdrop Gel Cream"],
      },
    ],
    status: "Shipped",
  },
];

export const readOrderRecords = (): ReadonlyArray<OrderRecord> => {
  const storedStatuses = readStoredOrderStatuses();
  const seededIds = new Set(fakeModuleDefinitions.orders?.rows.map((row) => row.id) ?? []);

  return baseOrderRecords
    .filter((order) => seededIds.size === 0 || seededIds.has(order.id))
    .map((order) => ({
      ...order,
      status: storedStatuses[order.id] ?? order.status,
    }));
};
