import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { confirmAction } from "@/shared/utils/confirm";
import { TableActionsMenu } from "@/shared/components/dashboard/TableActionsMenu";
import { hideRowIds, readHiddenRowIds } from "@/pages/dashboard/common/dashboardTableState";
import { readCustomerRecords } from "./customerData";

const statusClassMap: Readonly<Record<string, string>> = {
  Active: "bg-[#eefaf5] text-[#0f7a58]",
  "Needs Attention": "bg-[#fff7e8] text-[#9a6700]",
  Guest: "bg-[#f5f5f7] text-[#4b5563]",
};

const verificationClassMap: Readonly<Record<string, string>> = {
  Verified: "bg-[#edf5ff] text-[#0066cc]",
  Pending: "bg-[#fff1f1] text-[#b42318]",
};

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch] = React.useState("");
  const [customers, setCustomers] = React.useState(() => {
    const hiddenIds = readHiddenRowIds("customers");
    return readCustomerRecords().filter((customer) => !hiddenIds.has(customer.id));
  });
  const [selectedIds, setSelectedIds] = React.useState<ReadonlyArray<string>>([]);

  const refreshCustomers = React.useCallback(() => {
    const hiddenIds = readHiddenRowIds("customers");
    setCustomers(readCustomerRecords().filter((customer) => !hiddenIds.has(customer.id)));
  }, []);

  React.useEffect(() => {
    refreshCustomers();
  }, [refreshCustomers]);

  const filteredCustomers = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;

    return customers.filter((customer) =>
      [
        customer.name,
        customer.email,
        customer.city,
        customer.segment,
        customer.status,
        customer.verification,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [customers, search]);

  const isAllSelected = filteredCustomers.length > 0 && filteredCustomers.every((customer) => selectedIds.includes(customer.id));

  const onDeleteCustomers = async (customerIds: ReadonlyArray<string>) => {
    if (customerIds.length === 0) return;

    const confirmed = await confirmAction(
      customerIds.length === 1 ? "Delete this customer?" : `Delete ${customerIds.length} selected customers?`
    );
    if (!confirmed) return;

    hideRowIds("customers", customerIds);
    refreshCustomers();
    setSelectedIds((current) => current.filter((id) => !customerIds.includes(id)));
    toast.success(`${customerIds.length} ${customerIds.length === 1 ? "customer" : "customers"} deleted.`);
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-(--text)">Customers</h1>
          <p className="mt-1 max-w-2xl text-sm text-(--muted)">
            Review customer accounts, see order history and wishlist activity, and open each customer profile for a standard ecommerce dashboard workflow.
          </p>
        </div>
      </section>

      <section className="rounded-[16px] border border-(--line) bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search customer, email, city, segment..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm"
          />
          {selectedIds.length > 0 ? (
            <Button variant="destructive" size="sm" onClick={() => void onDeleteCustomers(selectedIds)}>
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
                  onCheckedChange={(checked) => setSelectedIds(checked ? filteredCustomers.map((customer) => customer.id) : [])}
                  aria-label="Select all customers"
                />
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">LTV</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead className="w-16 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-(--muted)">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : null}
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id} className="cursor-pointer" onClick={() => navigate(`/dashboard/customers/${customer.id}`)}>
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(customer.id)}
                    onCheckedChange={(checked) =>
                      setSelectedIds((current) =>
                        checked === true ? [...current, customer.id] : current.filter((id) => id !== customer.id)
                      )
                    }
                    aria-label={`Select ${customer.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-(--text)">{customer.name}</div>
                    <div className="text-xs text-(--muted)">{customer.email}</div>
                  </div>
                </TableCell>
                <TableCell>{customer.segment}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell className="text-right font-medium">{customer.ltv}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClassMap[customer.status] ?? statusClassMap.Active}`}>
                    {customer.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${verificationClassMap[customer.verification] ?? verificationClassMap.Verified}`}>
                    {customer.verification}
                  </span>
                </TableCell>
                <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                  <TableActionsMenu
                    onView={() => navigate(`/dashboard/customers/${customer.id}`)}
                    onEdit={() => navigate(`/dashboard/customers/${customer.id}`)}
                    onDelete={() => void onDeleteCustomers([customer.id])}
                    viewLabel="View Customer"
                    editLabel="Edit Customer"
                    deleteLabel="Delete Customer"
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
