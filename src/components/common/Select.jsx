import { forwardRef } from "react";
const Select = forwardRef(
  ({ label, options, error, helperText, className = "", id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : void 0);
    return <div className="w-full">
        {label && <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>}
        <div className="relative">
          <select
      ref={ref}
      id={selectId}
      className={`block w-full rounded-lg border bg-white text-slate-900 text-sm py-2 px-3 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 cursor-pointer ${error ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200" : "border-slate-300 focus:border-[#E4232C] focus:ring-[#E4232C]/20"} ${className}`}
      {...props}
    >
            {options.map((opt) => <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>)}
          </select>
        </div>
        {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      </div>;
  }
);
Select.displayName = "Select";
export {
  Select
};
