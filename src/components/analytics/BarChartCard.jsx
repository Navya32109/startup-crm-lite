import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS } from '../../constants/analyticsColors';
import { Calendar } from 'lucide-react';

/**
 * Custom tooltip styled for the Leads Trend Bar Chart.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-[11px] animate-fade-in select-none">
        <p className="font-extrabold text-slate-950 dark:text-white uppercase tracking-wide">
          {data.name}
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-black text-xs mt-1">
          {payload[0].value} {payload[0].value === 1 ? 'Lead Created' : 'Leads Created'}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * BarChartCard Component
 * Renders a bar chart representing monthly lead intake over the last 6 months.
 */
export default function BarChartCard({ data = [] }) {
  const { isDark } = useTheme();

  // Dynamic theme colors
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#1E293B' : '#F1F5F9';
  const barColor = STATUS_COLORS.Contacted; // Primary Blue: #2563EB

  const hasData = data && data.length > 0 && data.some(d => d.count > 0);

  return (
    <div className="bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px]">
      
      {/* Panel Header */}
      <div>
        <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
          Monthly Leads Intake
        </h3>
        <p className="text-[10px] text-slate-450 dark:text-slate-500">
          Inbound client registration counts grouped by creation month history.
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-56 text-slate-400 dark:text-slate-600 select-none">
          <Calendar size={28} className="mb-2 text-slate-300 dark:text-slate-700" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">No trend history</span>
        </div>
      ) : (
        <div className="h-56 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
            >
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
                allowDecimals={false}
                tick={{ fill: textColor, fontSize: 10, fontWeight: 600 }} 
              />
              <Tooltip 
                cursor={{ fill: isDark ? '#1e293b' : '#f8fafc', opacity: 0.3 }}
                content={<CustomTooltip />} 
              />
              <Bar 
                dataKey="count" 
                fill={barColor} 
                radius={[4, 4, 0, 0]} 
                maxBarSize={32}
                isAnimationActive={true}
                animationDuration={800}
              />
            </BarChart>
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
