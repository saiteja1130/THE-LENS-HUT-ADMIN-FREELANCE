import { forwardRef } from "react";
const Input = forwardRef(
  ({ label, error, helperText, leftIcon, rightIcon, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : void 0);
    return <div className="w-full">
        {label && <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>}
        <div className="relative rounded-lg shadow-sm">
          {leftIcon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>}
          <input
      ref={ref}
      id={inputId}
      className={`block w-full rounded-lg border bg-white text-slate-900 text-sm py-2 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${leftIcon ? "pl-9" : "pl-3"} ${rightIcon ? "pr-9" : "pr-3"} ${error ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200" : "border-slate-300 focus:border-[#E4232C] focus:ring-[#E4232C]/20"} ${className}`}
      {...props}
    />
          {rightIcon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
              {rightIcon}
            </div>}
        </div>
        {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      </div>;
  }
);
Input.displayName = "Input";
export {
  Input
};
