import { Filter, RotateCcw } from "lucide-react";
import { SearchInput } from "../common/SearchInput";
import { ORDER_STATUSES, getOrderStatusColor } from "../../utils/orderStatus";

const OrderFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
}) => {
  const hasActiveFilters = search !== "" || statusFilter !== "All";

  return (
    <div className="mb-6 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all sm:p-5">
      {/* Search Bar & Clear Filter Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search by Order ID, customer name, or phone..."
            className="w-full"
          />
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              <Filter className="h-3 w-3" />
              Filtered
            </span>
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200/80 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 shadow-2xs transition-colors hover:bg-rose-100 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-3.5 pb-1">
        <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Status:
        </span>
        <div className="flex items-center gap-1.5">
          {["All", ...ORDER_STATUSES].map((status) => {
            const isActive = statusFilter === status;
            const colors = status !== "All" ? getOrderStatusColor(status) : null;

            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusFilterChange(status)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#14232E] text-white font-semibold shadow-xs"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                {colors && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${colors.dot} shrink-0`}
                  />
                )}
                <span>{status}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { OrderFilters };
