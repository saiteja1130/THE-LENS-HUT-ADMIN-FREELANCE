import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";

const SalesChart = ({ weeklyData, monthlyData }) => {
  const [period, setPeriod] = useState("weekly");
  const activeData = period === "weekly" ? weeklyData : monthlyData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs">
          <p className="font-semibold text-slate-800 mb-1">{label}</p>
          <p className="text-slate-600">
            Sales:{" "}
            <span className="font-bold text-[#E4232C]">
              {formatCurrency(payload[0].value)}
            </span>
          </p>
          {payload[0].payload.orders !== undefined && (
            <p className="text-slate-500 mt-0.5">
              Orders:{" "}
              <span className="font-semibold text-slate-700">
                {payload[0].payload.orders}
              </span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Sales Overview</h2>
          <p className="text-xs text-slate-500">Revenue performance over time</p>
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setPeriod("weekly")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              period === "weekly"
                ? "bg-white text-[#E4232C] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setPeriod("monthly")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              period === "monthly"
                ? "bg-white text-[#E4232C] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E4232C" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#E4232C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
              tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#E4232C"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export { SalesChart };
