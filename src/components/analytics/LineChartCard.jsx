import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_COLORS } from '../../constants/analyticsColors';
import { TrendingUp } from 'lucide-react';

/**
 * Custom tooltip styled for the Conversion Trend Line Chart.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl shadow-xl text-[11px] animate-fade-in select-none">
        <p className="font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">
          {data.name}
        </p>
        <p className="text-emerald-650 dark:text-emerald-450 font-black text-xs mt-1">
          Conversion Rate: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

/**
 * LineChartCard Component
 * Renders a smooth line chart tracking percentage conversion of leads into won sales monthly.
 */
export default function LineChartCard({ data = [] }) {
  const { isDark } = useTheme();

  // Dynamic theme colors
  const textColor = isDark ? '#9CA3AF' : '#6B7280';
  const gridColor = isDark ? '#374151' : '#F3F4F6';
  const lineColor = STATUS_COLORS.Won; // Success Green: #22C55E

  const hasData = data && data.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px]">
      
      {/* Panel Header */}
      <div>
        <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm">
          Conversion Trend History
        </h3>
        <p className="text-[10px] text-gray-500 dark:text-gray-450">
          Monthly efficiency ratio calculated as Won opportunities over total leads.
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-56 text-gray-400 dark:text-gray-500 select-none">
          <TrendingUp size={28} className="mb-2 text-gray-300 dark:text-gray-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">No conversion history</span>
        </div>
      ) : (
        <div className="h-56 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
                tick={{ fill: textColor, fontSize: 10, fontWeight: 600 }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke={lineColor} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 1, stroke: '#fff', fill: lineColor }}
                activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff', fill: lineColor }}
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Footer */}
      <div className="flex justify-end text-[10px] text-gray-400 dark:text-gray-500 font-semibold select-none pt-2 border-t border-gray-100 dark:border-gray-700/60">
        <span>Target Conversion: &gt;25%</span>
      </div>

    </div>
  );
}
