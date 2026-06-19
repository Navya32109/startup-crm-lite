import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS } from '../../constants/analyticsColors';
import { IndianRupee } from 'lucide-react';

/**
 * Helper to format Rupee tick labels cleanly (e.g., ₹1.2L, ₹50K)
 */
const formatTick = (val) => {
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(1).replace(/\.0$/, '')}L`;
  }
  if (val >= 1000) {
    return `₹${(val / 1000).toFixed(0)}K`;
  }
  return `₹${val}`;
};

/**
 * Custom tooltip styled for the Revenue Area Chart.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formattedVal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(payload[0].value);

    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-xl shadow-xl text-[11px] animate-fade-in select-none">
        <p className="font-extrabold text-gray-950 dark:text-white uppercase tracking-wide">
          {data.name} Revenue
        </p>
        <p className="text-emerald-650 dark:text-emerald-450 font-black text-xs mt-1">
          {formattedVal}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * RevenueChartCard Component
 * Displays an Area Chart tracing cumulative revenue realized from won opportunities monthly.
 */
export default function RevenueChartCard({ data = [] }) {
  const { isDark } = useTheme();

  // Dynamic theme colors
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#1E293B' : '#F1F5F9';
  const revenueColor = STATUS_COLORS.Won; // Success Green: #22C55E

  const hasData = data && data.length > 0 && data.some(d => d.revenue > 0);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px]">
      
      {/* Panel Header */}
      <div>
        <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm">
          Won Revenue Growth
        </h3>
        <p className="text-[10px] text-gray-500 dark:text-gray-400">
          Monthly realization values aggregated from closed-won client accounts.
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-56 text-slate-400 dark:text-slate-600 select-none">
          <IndianRupee size={28} className="mb-2 text-slate-300 dark:text-slate-700" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">No revenue data</span>
        </div>
      ) : (
        <div className="h-56 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={revenueColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={revenueColor} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={gridColor} 
              />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: textColor, fontSize: 10, fontWeight: 600 }} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tickFormatter={formatTick}
                tick={{ fill: textColor, fontSize: 10, fontWeight: 600 }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke={revenueColor} 
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                isAnimationActive={true}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Footer */}
      <div className="flex justify-end text-[10px] text-slate-400 dark:text-slate-500 font-semibold select-none pt-2 border-t border-slate-100 dark:border-slate-850/60">
        <span>Timeline: Last 6 Months</span>
      </div>

    </div>
  );
}
