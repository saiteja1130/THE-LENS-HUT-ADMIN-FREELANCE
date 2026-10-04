const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
];
const getOrderStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return {
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-200",
        dot: "bg-amber-500"
      };
    case "Processing":
      return {
        bg: "bg-blue-50",
        text: "text-blue-800",
        border: "border-blue-200",
        dot: "bg-blue-500"
      };
    case "Shipped":
      return {
        bg: "bg-indigo-50",
        text: "text-indigo-800",
        border: "border-indigo-200",
        dot: "bg-indigo-500"
      };
    case "Delivered":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        border: "border-emerald-200",
        dot: "bg-emerald-500"
      };
    case "Cancelled":
      return {
        bg: "bg-rose-50",
        text: "text-rose-800",
        border: "border-rose-200",
        dot: "bg-rose-500"
      };
    default:
      return {
        bg: "bg-slate-50",
        text: "text-slate-800",
        border: "border-slate-200",
        dot: "bg-slate-500"
      };
  }
};
const getOrderStatusLabel = (status) => {
  return status;
};
export {
  ORDER_STATUSES,
  getOrderStatusColor,
  getOrderStatusLabel
};
