import { useNavigate } from "react-router-dom";
import { Eye, ShoppingBag } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { OrderStatusBadge } from "../orders/OrderStatusBadge";
import { Button } from "../common/Button";
import { EmptyState } from "../common/EmptyState";
const CustomerOrderHistory = ({
  orders,
  isLoading = false
}) => {
  const navigate = useNavigate();
  if (isLoading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-center text-slate-400">
        Loading customer order history...
      </div>;
  }
  if (orders.length === 0) {
    return <EmptyState
      title="No Orders Placed Yet"
      description="This customer has not placed any orders through The Lens Hut yet."
      icon={<ShoppingBag className="w-8 h-8 text-slate-400" />}
    />;
  }
  return <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">Order History ({orders.length})</h2>
        <p className="text-xs text-slate-500">Comprehensive log of past purchases</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  {order.orderNumber}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                  {formatDate(order.orderDate)}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-700">
                  {order.items.map((i) => i.name).join(", ")}
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="py-3.5 px-4 text-xs">
                  <span className="font-medium text-slate-700">{order.paymentMethod}</span>
                  <span className="text-slate-400 ml-1">({order.paymentStatus})</span>
                </td>
                <td className="py-3.5 px-4">
                  <OrderStatusBadge status={order.orderStatus} size="sm" />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Button
    variant="outline"
    size="sm"
    onClick={() => navigate(`/orders/${order.id}`)}
    icon={<Eye className="w-3.5 h-3.5" />}
  >
                    View
                  </Button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
};
export {
  CustomerOrderHistory
};
