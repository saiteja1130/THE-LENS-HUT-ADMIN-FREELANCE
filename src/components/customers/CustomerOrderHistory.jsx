import { useNavigate } from "react-router-dom";
import { Eye, ShoppingBag } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { OrderStatusBadge } from "../orders/OrderStatusBadge";
import { Button } from "../common/Button";
import { EmptyState } from "../common/EmptyState";
import { Loader } from "../common/Loader";

const CustomerOrderHistory = ({ orders = [], isLoading = false }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <Loader message="Loading customer order history..." />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No Orders Placed Yet"
        description="This customer has not placed any orders through The Lens Hut yet."
        icon={<ShoppingBag className="h-8 w-8 text-slate-400" />}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs transition-all">
      <div className="border-b border-slate-100 p-5 sm:px-6">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900">Order History</h2>
          <span className="inline-flex items-center rounded-full border border-slate-200/70 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          Comprehensive log of customer purchases and fulfillment statuses
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">Order ID</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Items</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="transition-colors hover:bg-slate-50/60"
              >
                <td className="py-3.5 px-4 sm:px-6">
                  <button
                    type="button"
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="font-mono text-xs sm:text-sm font-bold text-slate-900 transition-colors hover:text-[#E4232C] cursor-pointer"
                  >
                    {order.orderNumber}
                  </button>
                </td>
                <td className="whitespace-nowrap py-3.5 px-4 text-xs text-slate-500">
                  {formatDate(order.orderDate)}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-700 max-w-[200px] truncate">
                  {(order.items || []).map((i) => i.name).join(", ")}
                </td>
                <td className="whitespace-nowrap py-3.5 px-4 font-bold text-slate-900 tabular-nums">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="whitespace-nowrap py-3.5 px-4 text-xs">
                  <span className="font-semibold text-slate-800">
                    {order.paymentMethod || "Online"}
                  </span>
                  <span
                    className={`ml-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      order.paymentStatus === "Paid"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                        : "bg-amber-50 text-amber-700 border border-amber-200/70"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="whitespace-nowrap py-3.5 px-4">
                  <OrderStatusBadge status={order.orderStatus} size="sm" />
                </td>
                <td className="whitespace-nowrap py-3.5 px-4 sm:px-6 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                    icon={<Eye className="h-3.5 w-3.5" />}
                    className="shadow-2xs hover:border-slate-300"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { CustomerOrderHistory };
