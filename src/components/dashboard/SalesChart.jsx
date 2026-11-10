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
      const dataPoint = payload[0];
      return (
        <div className="min-w-40 rounded-xl border border-slate-200/90 bg-white/95 p-3.5 text-xs shadow-lg backdrop-blur-xs">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
            <span className="font-semibold text-slate-900">{label}</span>
            <span className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              {period === "weekly" ? "Day" : "Month"}
            </span>
          </div>

          <div className="mt-2.5 space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2 w-2 rounded-full bg-[#E4232C]" />
                Sales:
              </span>
              <span className="font-bold text-slate-900">
                {formatCurrency(dataPoint.value)}
              </span>
            </div>

            {dataPoint.payload?.orders !== undefined && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Orders:</span>
                <span className="font-semibold text-slate-700">
                  {dataPoint.payload.orders}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all sm:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Sales Overview</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E4232C]" />
              Store Revenue
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Revenue performance over time
          </p>
        </div>

        <div className="inline-flex self-start rounded-lg border border-slate-200/80 bg-slate-50 p-1 sm:self-auto">
          <button
            type="button"
            onClick={() => setPeriod("weekly")}
            className={`cursor-pointer rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
              period === "weekly"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setPeriod("monthly")}
            className={`cursor-pointer rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
              period === "monthly"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="h-72 w-full pt-6 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={activeData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E4232C" stopOpacity={0.24} />
                <stop offset="95%" stopColor="#E4232C" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#F1F5F9"
            />
            <XAxis
              dataKey="date"
              axisLine={{ stroke: "#E2E8F0" }}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
              tickFormatter={(val) =>
                `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
              }
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#E4232C"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#salesGradient)"
              activeDot={{
                r: 5,
                fill: "#E4232C",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export { SalesChart };
