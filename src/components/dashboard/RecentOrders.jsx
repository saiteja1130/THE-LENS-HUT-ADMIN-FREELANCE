import { useNavigate } from "react-router-dom";
import { Eye, ArrowRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { OrderStatusBadge } from "../orders/OrderStatusBadge";
import { Button } from "../common/Button";
const RecentOrders = ({ orders }) => {
  const navigate = useNavigate();
  const displayOrders = orders.slice(0, 6);
  return <div className="rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
          <p className="text-xs text-slate-500">Latest customer purchases</p>
        </div>
        <Button
    variant="ghost"
    size="sm"
    onClick={() => navigate("/orders")}
    icon={<ArrowRight className="w-3.5 h-3.5" />}
  >
          View All Orders
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayOrders.length === 0 ? <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No recent orders available
                </td>
              </tr> : displayOrders.map((order) => <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900">{order.customer.name}</div>
                    <div className="text-xs text-slate-400">{order.customer.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <OrderStatusBadge status={order.orderStatus} />
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
  RecentOrders
};
