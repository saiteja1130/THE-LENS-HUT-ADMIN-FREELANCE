import { Filter, RotateCcw } from "lucide-react";
import { SearchInput } from "../common/SearchInput";
import { PRODUCT_CATEGORIES } from "../../utils/constants";

const ProductFilters = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  stockStatus,
  onStockStatusChange,
  status,
  onStatusChange,
  onClearFilters,
}) => {
  const hasActiveFilters =
    search !== "" ||
    category !== "All" ||
    stockStatus !== "All" ||
    status !== "All";

  return (
    <div className="mb-6 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all sm:p-5">
      {/* Top Search & Filter Actions Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search by product name, SKU, or brand..."
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

      {/* Filter Select Dropdowns */}
      <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-3.5 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Category
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={`w-full cursor-pointer appearance-none rounded-lg border py-2 pl-3 pr-8 text-xs transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
                category !== "All"
                  ? "border-[#14232E]/30 bg-slate-50 font-semibold text-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50/60"
              }`}
            >
              <option value="All">All Categories</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Stock Availability
          </label>
          <div className="relative">
            <select
              value={stockStatus}
              onChange={(e) => onStockStatusChange(e.target.value)}
              className={`w-full cursor-pointer appearance-none rounded-lg border py-2 pl-3 pr-8 text-xs transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
                stockStatus !== "All"
                  ? "border-[#14232E]/30 bg-slate-50 font-semibold text-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50/60"
              }`}
            >
              <option value="All">All Stock Levels</option>
              <option value="In Stock">In Stock (&gt; 5)</option>
              <option value="Low Stock">Low Stock (1 - 5)</option>
              <option value="Out of Stock">Out of Stock (0)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Visibility Status
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className={`w-full cursor-pointer appearance-none rounded-lg border py-2 pl-3 pr-8 text-xs transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
                status !== "All"
                  ? "border-[#14232E]/30 bg-slate-50 font-semibold text-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50/60"
              }`}
            >
              <option value="All">All Statuses</option>
              <option value="active">Active (Visible)</option>
              <option value="inactive">Inactive (Hidden)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProductFilters };
