import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS } from '../../constants/analyticsColors';
import { Share2 } from 'lucide-react';

/**
 * Custom tooltip styled for the Lead Sources Bar Chart.
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
          {payload[0].value} {payload[0].value === 1 ? 'Lead' : 'Leads'}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * LeadSourceChart Component
 * Renders a horizontal bar chart displaying incoming leads grouped by marketing channel.
 */
export default function LeadSourceChart({ data = [] }) {
  const { isDark } = useTheme();

  // Dynamic theme colors
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#1E293B' : '#F1F5F9';
  
  // Use a nice gradient-like palette or standard theme blue
  const barColors = [
    '#2563EB', // Blue
    '#6366F1', // Indigo
    '#7C3AED', // Purple
    '#14B8A6', // Teal
    '#F59E0B', // Amber
    '#94A3B8'  // Slate
  ];

  const hasData = data && data.length > 0;

  return (
    <div className="bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px]">
      
      {/* Panel Header */}
      <div>
        <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
          Acquisition Channels
        </h3>
        <p className="text-[10px] text-slate-450 dark:text-slate-500">
          Distribution volume of leads segmented by referral source channel.
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-56 text-slate-400 dark:text-slate-600 select-none">
          <Share2 size={28} className="mb-2 text-slate-300 dark:text-slate-700" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">No source details</span>
        </div>
      ) : (
        <div className="h-56 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical"
              margin={{ top: 10, right: 10, left: -14, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                horizontal={false} 
                stroke={gridColor} 
              />
              <XAxis 
                type="number"
                tickLine={false} 
                axisLine={false}
                allowDecimals={false}
                tick={{ fill: textColor, fontSize: 10, fontWeight: 600 }} 
              />
              <YAxis 
                dataKey="name"
                type="category"
                tickLine={false} 
                axisLine={false}
                width={85}
                tick={{ fill: textColor, fontSize: 10, fontWeight: 600 }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                radius={[0, 4, 4, 0]} 
                maxBarSize={20}
                isAnimationActive={true}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={barColors[index % barColors.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Footer */}
      <div className="flex justify-end text-[10px] text-slate-400 dark:text-slate-500 font-semibold select-none pt-2 border-t border-slate-100 dark:border-slate-850/60">
        <span>Ranked by Volume Descending</span>
      </div>

    </div>
  );
}
