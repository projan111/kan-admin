import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { confirmAction } from "@/shared/utils/confirm";
import { TableActionsMenu } from "@/shared/components/dashboard/TableActionsMenu";
import { hideRowIds, readHiddenRowIds } from "@/pages/dashboard/common/dashboardTableState";
import { readOrderRecords } from "./orderData";

const statusClassMap: Readonly<Record<string, string>> = {
  Pending: "bg-[#fff7e8] text-[#9a6700]",
  Confirmed: "bg-[#edf5ff] text-[#0066cc]",
  Packed: "bg-[#edf5ff] text-[#1d4ed8]",
  Shipped: "bg-[#eef2ff] text-[#4338ca]",
  Delivered: "bg-[#eefaf5] text-[#0f7a58]",
  Cancelled: "bg-[#fff1f1] text-[#b42318]",
  Returned: "bg-[#fff1f1] text-[#b42318]",
};

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch] = React.useState("");
  const [orders, setOrders] = React.useState(readOrderRecords());
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>([]);

  const refreshOrders = React.useCallback(() => {
    const hiddenIds = readHiddenRowIds("orders");
    setOrders(readOrderRecords().filter((order) => !hiddenIds.has(order.id)));
  }, []);

  React.useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const filteredOrders = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((order) =>
      [
        order.id,
        order.orderNumber,
        order.customerName,
        order.customerEmail,
        order.city,
        order.paymentMethod,
        order.status,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [orders, search]);

  const isAllSelected = filteredOrders.length > 0 && filteredOrders.every((order) => selectedIds.includes(order.id));

  const onDeleteOrders = async (orderIds: ReadonlyArray<string>) => {
    if (orderIds.length === 0) return;

    const confirmed = await confirmAction(
      orderIds.length === 1 ? "Delete this order?" : `Delete ${orderIds.length} selected orders?`
    );
    if (!confirmed) return;

    hideRowIds("orders", orderIds);
    refreshOrders();
    setSelectedIds((current) => current.filter((id) => !orderIds.includes(id)));
    toast.success(`${orderIds.length} ${orderIds.length === 1 ? "order" : "orders"} deleted.`);
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-(--text)">Orders</h1>
          <p className="mt-1 max-w-2xl text-sm text-(--muted)">
            Review customer orders, open full order details, and update the order status directly from the dashboard.
          </p>
        </div>
      </section>

      <section className="rounded-[16px] border border-(--line) bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search order, customer, city, status..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm"
          />
          {selectedIds.length > 0 ? (
            <Button variant="destructive" size="sm" onClick={() => void onDeleteOrders(selectedIds)}>
              <Trash2 size={14} />
              Delete Selected
            </Button>
          ) : null}
        </div>
      </section>

      <section className="overflow-hidden rounded-[16px] border border-(--line) bg-white">
        <Table>
          <TableHeader className="bg-[#f5f5f7]">
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) => setSelectedIds(checked ? filteredOrders.map((order) => order.id) : [])}
                  aria-label="Select all orders"
                />
              </TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-(--muted)">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : null}
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="cursor-pointer" onClick={() => navigate(`/dashboard/orders/${order.id}`)}>
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(order.id)}
                    onCheckedChange={(checked) =>
                      setSelectedIds((current) =>
                        checked === true ? [...current, order.id] : current.filter((id) => id !== order.id)
                      )
                    }
                    aria-label={`Select ${order.orderNumber}`}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-(--text)">{order.orderNumber}</div>
                    <div className="text-xs text-(--muted)">{order.placedAt}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-(--text)">{order.customerName}</div>
                    <div className="text-xs text-(--muted)">{order.customerEmail}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-(--text)">{order.paymentMethod}</div>
                    <div className="text-xs text-(--muted)">{order.paymentStatus}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{order.total}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClassMap[order.status] ?? statusClassMap.Pending}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <TableActionsMenu
                    onView={() => navigate(`/dashboard/orders/${order.id}`)}
                    onEdit={() => navigate(`/dashboard/orders/${order.id}`)}
                    onDelete={() => void onDeleteOrders([order.id])}
                    viewLabel="View Order"
                    editLabel="Edit Order"
                    deleteLabel="Delete Order"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};
