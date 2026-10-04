const StatCard = ({
  title,
  value,
  subtext,
  subtextHighlight,
  icon: Icon,
  trend
}) => {
  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
          <Icon className="w-5 h-5 text-slate-700" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        
        <div className="mt-2 flex items-center justify-between text-xs">
          {subtext && <span className="text-slate-500">
              {subtext}{" "}
              {subtextHighlight && <span className="font-semibold text-slate-800">{subtextHighlight}</span>}
            </span>}

          {trend && <span
    className={`font-medium ${trend.isPositive ? "text-emerald-600" : "text-rose-600"}`}
  >
              {trend.value}
            </span>}
        </div>
      </div>
    </div>;
};
export {
  StatCard
};
