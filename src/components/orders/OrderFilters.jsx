import { SearchInput } from "../common/SearchInput";
import { ORDER_STATUSES } from "../../utils/orderStatus";
const OrderFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters
}) => {
  const hasActiveFilters = search !== "" || statusFilter !== "All";
  return <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {
    /* Search */
  }
        <div className="w-full md:max-w-md">
          <SearchInput
    value={search}
    onChange={onSearchChange}
    placeholder="Search by Order ID, customer name, or phone..."
  />
        </div>

        {
    /* Clear Filters Button */
  }
        {hasActiveFilters && <button
    type="button"
    onClick={onClearFilters}
    className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors self-end md:self-center cursor-pointer"
  >
            Clear Filters
          </button>}
      </div>

      {
    /* Status Filter Tabs */
  }
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
          Status:
        </span>
        {["All", ...ORDER_STATUSES].map((status) => {
    const isActive = statusFilter === status;
    return <button
      key={status}
      type="button"
      onClick={() => onStatusFilterChange(status)}
      className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${isActive ? "bg-slate-900 text-white font-semibold shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
    >
              {status}
            </button>;
  })}
      </div>
    </div>;
};
export {
  OrderFilters
};
