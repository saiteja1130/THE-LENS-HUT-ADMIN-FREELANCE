import { getStockStatus, getStockBadgeColor } from "../../utils/constants";
const StockBadge = ({ stock }) => {
  const status = getStockStatus(stock);
  const colors = getStockBadgeColor(stock);
  return <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
  >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
      <span>{status}</span>
      <span className="text-[10px] font-normal opacity-75">({stock})</span>
    </span>;
};
export {
  StockBadge
};
