const Badge = ({
  children,
  variant = "default",
  dot = false,
  className = "",
}) => {
  const variantStyles = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    primary: "bg-[#FFEBEC] text-[#E4232C] border-[#FFD2D4] font-semibold",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    secondary: "bg-[#14232E]/10 text-[#14232E] border-[#14232E]/20 font-semibold",
    gold: "bg-[#FFEBEC] text-[#E4232C] border-[#FFD2D4] font-semibold",
  };

  const dotColors = {
    default: "bg-slate-400",
    primary: "bg-[#E4232C]",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-blue-500",
    secondary: "bg-[#14232E]",
    gold: "bg-[#E4232C]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dotColors[variant] || dotColors.default
          }`}
        />
      )}
      {children}
    </span>
  );
};

export { Badge };
