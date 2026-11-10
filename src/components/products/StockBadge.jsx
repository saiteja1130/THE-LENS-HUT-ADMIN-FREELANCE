import { getStockStatus, getStockBadgeColor } from "../../utils/constants";

const StockBadge = ({ stock }) => {
  const status = getStockStatus(stock);
  const colors = getStockBadgeColor(stock);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border} shadow-2xs`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${colors.dot}`} />
      <span className="whitespace-nowrap">{status}</span>
      <span className="font-mono text-[10px] font-normal opacity-80">
        ({stock})
      </span>
    </span>
  );
};

export { StockBadge };
