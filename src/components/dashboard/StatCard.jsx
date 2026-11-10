import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({
  title,
  value,
  subtext,
  subtextHighlight,
  icon: Icon,
  trend,
  className = "",
}) => {
  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-sm sm:p-6 ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-700 transition-colors group-hover:bg-slate-100/80">
              <Icon className="h-5 w-5 text-slate-700" />
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums sm:text-3xl">
            {value}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100/90 pt-3 text-xs">
        {subtext ? (
          <span className="truncate text-slate-500">
            {subtext}{" "}
            {subtextHighlight && (
              <span className="font-semibold text-slate-900">
                {subtextHighlight}
              </span>
            )}
          </span>
        ) : (
          <span />
        )}

        {trend && (
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${
              trend.isPositive
                ? "border-emerald-200/70 bg-emerald-50 text-emerald-700"
                : "border-rose-200/70 bg-rose-50 text-rose-700"
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 shrink-0" />
            ) : (
              <TrendingDown className="h-3 w-3 shrink-0" />
            )}
            <span>{trend.value}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export { StatCard };
