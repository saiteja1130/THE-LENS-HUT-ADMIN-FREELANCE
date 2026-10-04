import { getOrderStatusColor } from "../../utils/orderStatus";
const OrderStatusBadge = ({
  status,
  size = "md"
}) => {
  const colors = getOrderStatusColor(status);
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  return <span
    className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses}`}
  >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
      <span>{status}</span>
    </span>;
};
export {
  OrderStatusBadge
};
