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
  onClearFilters
}) => {
  const hasActiveFilters = search !== "" || category !== "All" || stockStatus !== "All" || status !== "All";
  return <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {
    /* Search */
  }
        <div className="w-full md:max-w-md">
          <SearchInput
    value={search}
    onChange={onSearchChange}
    placeholder="Search by product name or SKU..."
  />
        </div>

        {
    /* Clear Filters */
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
    /* Select Dropdowns Row */
  }
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
    value={category}
    onChange={(e) => onCategoryChange(e.target.value)}
    className="w-full rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/10"
  >
            <option value="All">All Categories</option>
            {PRODUCT_CATEGORIES.map((cat) => <option key={cat} value={cat}>
                {cat}
              </option>)}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Stock Availability
          </label>
          <select
    value={stockStatus}
    onChange={(e) => onStockStatusChange(e.target.value)}
    className="w-full rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/10"
  >
            <option value="All">All Stock Levels</option>
            <option value="In Stock">In Stock (&gt; 5)</option>
            <option value="Low Stock">Low Stock (1 - 5)</option>
            <option value="Out of Stock">Out of Stock (0)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Visibility Status
          </label>
          <select
    value={status}
    onChange={(e) => onStatusChange(e.target.value)}
    className="w-full rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/10"
  >
            <option value="All">All Statuses</option>
            <option value="active">Active (Visible)</option>
            <option value="inactive">Inactive (Hidden)</option>
          </select>
        </div>
      </div>
    </div>;
};
export {
  ProductFilters
};
