import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Table } from "../common/Table";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../common/Button";
const CustomerTable = ({
  customers,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const columns = [
    {
      header: "Customer",
      render: (customer) => <div className="flex items-center gap-3">
          {customer.avatarUrl ? <img
        src={customer.avatarUrl}
        alt={customer.name}
        className="w-9 h-9 rounded-full object-cover border border-slate-200"
      /> : <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
              {customer.name.charAt(0)}
            </div>}
          <div>
            <div className="font-semibold text-slate-900">{customer.name}</div>
            <div className="text-xs text-slate-400">{customer.email}</div>
          </div>
        </div>
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "text-xs text-slate-600 whitespace-nowrap"
    },
    {
      header: "Date Joined",
      render: (customer) => <span className="text-xs text-slate-500 whitespace-nowrap">
          {formatDate(customer.dateJoined)}
        </span>
    },
    {
      header: "Total Orders",
      render: (customer) => <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800">
          {customer.totalOrders} {customer.totalOrders === 1 ? "order" : "orders"}
        </span>
    },
    {
      header: "Total Spent",
      render: (customer) => <span className="font-semibold text-slate-900">
          {formatCurrency(customer.totalSpent)}
        </span>
    },
    {
      header: "Location",
      render: (customer) => <span className="text-xs text-slate-500">
          {customer.address ? `${customer.address.city}, ${customer.address.state}` : "India"}
        </span>
    },
    {
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      render: (customer) => <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/customers/${customer.id}`)}
        icon={<Eye className="w-3.5 h-3.5" />}
      >
          View Profile
        </Button>
    }
  ];
  return <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <Table
    columns={columns}
    data={customers}
    keyExtractor={(item) => item.id}
    isLoading={isLoading}
  />
    </div>;
};
export {
  CustomerTable
};
