import { useNavigate } from "react-router-dom";
import { Eye, MapPin } from "lucide-react";
import { Table } from "../common/Table";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../common/Button";

const CustomerTable = ({ customers = [], isLoading = false }) => {
  const navigate = useNavigate();

  const columns = [
    {
      header: "Customer",
      className: "w-64 min-w-[220px]",
      render: (customer) => (
        <div className="flex items-center gap-3">
          {customer.avatarUrl ? (
            <img
              src={customer.avatarUrl}
              alt={customer.name}
              className="h-10 w-10 shrink-0 rounded-full border border-slate-200/80 object-cover shadow-2xs"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1E3545] bg-[#14232E] text-xs font-bold text-white shadow-2xs">
              {customer.name?.charAt(0) || "C"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => navigate(`/customers/${customer.id}`)}
              className="block truncate text-left text-sm font-semibold text-slate-900 transition-colors hover:text-[#E4232C] cursor-pointer"
            >
              {customer.name}
            </button>
            <div className="truncate text-xs text-slate-400 mt-0.5">
              {customer.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "whitespace-nowrap font-mono text-xs text-slate-600",
    },
    {
      header: "Date Joined",
      className: "whitespace-nowrap text-xs text-slate-500",
      render: (customer) => formatDate(customer.dateJoined),
    },
    {
      header: "Total Orders",
      className: "whitespace-nowrap text-center",
      headerClassName: "text-center",
      render: (customer) => (
        <span className="inline-flex items-center rounded-full border border-slate-200/60 bg-slate-100/90 px-2.5 py-0.5 text-xs font-semibold text-slate-700 shadow-2xs">
          {customer.totalOrders}{" "}
          {customer.totalOrders === 1 ? "order" : "orders"}
        </span>
      ),
    },
    {
      header: "Total Spent",
      className: "whitespace-nowrap font-bold text-slate-900 tabular-nums text-sm",
      render: (customer) => formatCurrency(customer.totalSpent),
    },
    {
      header: "Location",
      className: "whitespace-nowrap text-xs text-slate-500",
      render: (customer) => (
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
          <span>
            {customer.address
              ? `${customer.address.city}, ${customer.address.state}`
              : "India"}
          </span>
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right whitespace-nowrap",
      headerClassName: "text-right",
      render: (customer) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/customers/${customer.id}`)}
          icon={<Eye className="h-3.5 w-3.5" />}
          className="shadow-2xs hover:border-slate-300"
        >
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-t-xl border border-slate-200/80 bg-white shadow-xs">
      <Table
        columns={columns}
        data={customers}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
      />
    </div>
  );
};

export { CustomerTable };
