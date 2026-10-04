import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Table } from "../common/Table";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { Button } from "../common/Button";
const OrderTable = ({
  orders,
  onStatusChange,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const columns = [
    {
      header: "Order ID",
      accessor: "orderNumber",
      className: "font-semibold text-slate-900 whitespace-nowrap",
      render: (order) => <div>
          <span className="font-semibold text-slate-900">{order.orderNumber}</span>
          {order.tracking && <div className="text-[11px] text-slate-400 mt-0.5">
              {order.tracking.courierName}: {order.tracking.trackingId}
            </div>}
        </div>
    },
    {
      header: "Order Date",
      accessor: "orderDate",
      className: "text-xs text-slate-500 whitespace-nowrap",
      render: (order) => formatDate(order.orderDate)
    },
    {
      header: "Customer",
      render: (order) => <div>
          <div className="font-medium text-slate-900">{order.customer.name}</div>
          <div className="text-xs text-slate-400">{order.customer.email}</div>
        </div>
    },
    {
      header: "Phone",
      render: (order) => <span className="text-xs text-slate-600 whitespace-nowrap">
          {order.customer.phone}
        </span>
    },
    {
      header: "Items",
      render: (order) => <span className="text-xs font-medium text-slate-700">
          {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
        </span>
    },
    {
      header: "Total",
      className: "font-semibold text-slate-900 whitespace-nowrap",
      render: (order) => formatCurrency(order.totalAmount)
    },
    {
      header: "Payment Method",
      render: (order) => <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800">
          {order.paymentMethod}
        </span>
    },
    {
      header: "Payment Status",
      render: (order) => <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${order.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}
      >
          {order.paymentStatus}
        </span>
    },
    {
      header: "Order Status",
      render: (order) => <OrderStatusSelect
        currentStatus={order.orderStatus}
        onStatusChange={(newStatus) => onStatusChange(order.id, newStatus)}
      />
    },
    {
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      render: (order) => <div className="flex items-center justify-end gap-2">
          <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/orders/${order.id}`)}
        icon={<Eye className="w-3.5 h-3.5" />}
      >
            View
          </Button>
        </div>
    }
  ];
  return <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <Table
    columns={columns}
    data={orders}
    keyExtractor={(item) => item.id}
    isLoading={isLoading}
  />
    </div>;
};
export {
  OrderTable
};
