import { useNavigate } from "react-router-dom";
import { Eye, Truck } from "lucide-react";
import { Table } from "../common/Table";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { Button } from "../common/Button";

const OrderTable = ({ orders = [], onStatusChange, isLoading = false }) => {
  const navigate = useNavigate();

  const columns = [
    {
      header: "Order ID",
      accessor: "orderNumber",
      className: "whitespace-nowrap",
      render: (order) => (
        <div>
          <button
            type="button"
            onClick={() => navigate(`/orders/${order.id}`)}
            className="font-mono text-xs sm:text-sm font-bold text-slate-900 transition-colors hover:text-[#E4232C] cursor-pointer"
          >
            {order.orderNumber}
          </button>
          {order.tracking && (
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Truck className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[130px]">
                {order.tracking.courierName}: {order.tracking.trackingId}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Order Date",
      accessor: "orderDate",
      className: "whitespace-nowrap text-xs text-slate-500",
      render: (order) => formatDate(order.orderDate),
    },
    {
      header: "Customer",
      render: (order) => {
        const name =
          order.customer?.name ||
          order.shippingAddress?.fullName ||
          "Customer";
        const email =
          order.customer?.email || order.shippingAddress?.email || "";

        return (
          <div>
            <div className="font-semibold text-slate-900 text-sm">{name}</div>
            {email && (
              <div className="mt-0.5 max-w-[140px] truncate text-xs text-slate-400">
                {email}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Phone",
      className: "whitespace-nowrap",
      render: (order) => (
        <span className="font-mono text-xs text-slate-600">
          {order.customer?.phone || order.shippingAddress?.phone || "N/A"}
        </span>
      ),
    },
    {
      header: "Items",
      className: "whitespace-nowrap",
      render: (order) => {
        const count = (order.items || []).reduce(
          (acc, item) => acc + (item.quantity || 1),
          0
        );
        return (
          <span className="inline-block rounded-md border border-slate-200/60 bg-slate-100/80 px-2 py-0.5 text-xs font-medium text-slate-700">
            {count} {count === 1 ? "item" : "items"}
          </span>
        );
      },
    },
    {
      header: "Total",
      className: "whitespace-nowrap font-bold text-slate-900 tabular-nums text-sm",
      render: (order) => formatCurrency(order.totalAmount),
    },
    {
      header: "Payment Method",
      className: "whitespace-nowrap",
      render: (order) => (
        <span className="inline-flex items-center rounded-md border border-slate-200/70 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
          {order.paymentMethod || "Online"}
        </span>
      ),
    },
    {
      header: "Payment Status",
      className: "whitespace-nowrap",
      render: (order) => {
        const isPaid = order.paymentStatus === "Paid";
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-2xs ${
              isPaid
                ? "border-emerald-200/70 bg-emerald-50 text-emerald-700"
                : "border-amber-200/70 bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                isPaid ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <span>{order.paymentStatus}</span>
          </span>
        );
      },
    },
    {
      header: "Order Status",
      className: "whitespace-nowrap",
      render: (order) => (
        <OrderStatusSelect
          currentStatus={order.orderStatus}
          onStatusChange={(newStatus) => onStatusChange(order.id, newStatus)}
        />
      ),
    },
    {
      header: "Actions",
      className: "text-right whitespace-nowrap",
      headerClassName: "text-right",
      render: (order) => (
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/orders/${order.id}`)}
            icon={<Eye className="h-3.5 w-3.5" />}
            className="shadow-2xs hover:border-slate-300"
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-t-xl border border-slate-200/80 bg-white shadow-xs">
      <Table
        columns={columns}
        data={orders}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
      />
    </div>
  );
};

export { OrderTable };
