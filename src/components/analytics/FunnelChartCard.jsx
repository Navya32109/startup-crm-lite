import React from 'react';
import { 
  ResponsiveContainer, 
  FunnelChart, 
  Funnel, 
  Cell, 
  Tooltip 
} from 'recharts';
import { STATUS_COLORS } from '../../constants/analyticsColors';
import { Layers } from 'lucide-react';

/**
 * Custom tooltip styled for the Funnel chart.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-[11px] animate-fade-in select-none">
        <p className="font-extrabold text-slate-950 dark:text-white uppercase tracking-wide">
          {data.stage}
        </p>
        <p className="text-slate-550 dark:text-slate-400 mt-1 font-semibold">
          Count: {data.count} {data.count === 1 ? 'Opportunity' : 'Opportunities'}
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-black text-xs mt-0.5">
          Conversion: {data.conversionRate}%
        </p>
        {data.stage !== 'New' && (
          <p className="text-rose-600 dark:text-rose-400 font-bold mt-0.5">
            Drop-off: {data.dropOffRate}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

/**
 * FunnelChartCard Component
 * Displays a Recharts sales funnel showing the flow of deals from New down to Won.
 * Incorporates stage counts, overall conversion rates, and stage drop-offs.
 */
export default function FunnelChartCard({ data = [] }) {
  // Map stage names to status colors
  const mappedData = data.map(item => {
    let color = STATUS_COLORS.New;
    if (item.stage === 'New') color = STATUS_COLORS.New;
    if (item.stage === 'Contacted') color = STATUS_COLORS.Contacted;
    if (item.stage === 'Meeting') color = STATUS_COLORS.Meeting;
    if (item.stage === 'Proposal') color = STATUS_COLORS.Proposal;
    if (item.stage === 'Won') color = STATUS_COLORS.Won;

    return {
      ...item,
      value: item.count,
      name: item.stage,
      color
    };
  });

  const hasData = data && data.length > 0 && data.some(d => d.count > 0);

  return (
    <div className="bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px]">
      
      {/* Panel Header */}
      <div>
        <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
          Sales Funnel Performance
        </h3>
        <p className="text-[10px] text-slate-450 dark:text-slate-500">
          Conversion velocity and drop-off ratios at each milestone stage.
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-600 select-none">
          <Layers size={28} className="mb-2 text-slate-300 dark:text-slate-700" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">No funnel data</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          
          {/* Recharts Funnel (col-span-6) */}
          <div className="sm:col-span-6 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <Tooltip content={<CustomTooltip />} />
                <Funnel
                  data={mappedData}
                  dataKey="count"
                  nameKey="stage"
                  isAnimationActive
                  animationDuration={800}
                >
                  {mappedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="outline-none focus:outline-none transition-all duration-300"
                    />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Funnel Stats (col-span-6) */}
          <div className="sm:col-span-6 space-y-2 text-xs select-none">
            {mappedData.map((item, idx) => (
              <div 
                key={item.stage} 
                className="flex flex-col p-2 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850/80 rounded-xl"
              >
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-1.5 truncate">
                    <span 
                      className="h-2 w-2 rounded-full shrink-0 animate-pulse" 
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-slate-700 dark:text-slate-300 truncate">
                      {item.stage}
                    </span>
                  </div>
                  <span className="font-display font-black text-slate-900 dark:text-white">
                    {item.count}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                  <span>Conv: <strong className="text-blue-600 dark:text-blue-400">{item.conversionRate}%</strong></span>
                  {idx > 0 && (
                    <span>Drop-off: <strong className="text-rose-600 dark:text-rose-400">{item.dropOffRate}%</strong></span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
