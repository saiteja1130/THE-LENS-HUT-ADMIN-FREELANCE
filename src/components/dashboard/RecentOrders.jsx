import { useNavigate } from "react-router-dom";
import { Eye, ArrowRight, ShoppingBag } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { OrderStatusBadge } from "../orders/OrderStatusBadge";
import { Button } from "../common/Button";

const RecentOrders = ({ orders = [] }) => {
  const navigate = useNavigate();
  const displayOrders = orders.slice(0, 6);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs transition-all">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
            {orders.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200/60">
                {orders.length} Total
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Latest customer purchases awaiting or completing fulfillment
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/orders")}
          icon={<ArrowRight className="h-3.5 w-3.5" />}
          className="self-start text-xs font-semibold text-slate-700 hover:text-slate-900 sm:self-auto"
        >
          View All Orders
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3 px-4 sm:px-6">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 sm:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3 border border-slate-200/60">
                      <ShoppingBag className="h-5 w-5 stroke-1.5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      No recent orders available
                    </p>
                    <p className="mt-1 text-xs text-slate-500 max-w-sm">
                      New customer orders will automatically appear here once placed.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              displayOrders.map((order) => {
                const customerName =
                  order.customer?.name ||
                  order.shippingAddress?.fullName ||
                  "Customer";
                const customerPhone =
                  order.customer?.phone ||
                  order.shippingAddress?.phone ||
                  "";

                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-xs sm:text-sm font-semibold text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">
                        {customerName}
                      </div>
                      {customerPhone && (
                        <div className="text-xs text-slate-400">
                          {customerPhone}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <OrderStatusBadge status={order.orderStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { RecentOrders };
