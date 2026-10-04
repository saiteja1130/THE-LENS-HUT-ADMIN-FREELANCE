import { Search, X } from "lucide-react";
const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  onClear
}) => {
  return <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E4232C] focus:outline-none focus:ring-2 focus:ring-[#E4232C]/20 transition-colors"
  />
      {value && <button
    type="button"
    onClick={() => {
      onChange("");
      if (onClear) onClear();
    }}
    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
    aria-label="Clear search"
  >
          <X className="w-4 h-4" />
        </button>}
    </div>;
};
export {
  SearchInput
};
