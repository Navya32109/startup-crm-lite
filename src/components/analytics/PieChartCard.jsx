import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Sector 
} from 'recharts';
import { Inbox } from 'lucide-react';

/**
 * Custom active shape component that renders the hovered slice with a larger radius.
 */
const renderActiveShape = (props) => {
  const { 
    cx, 
    cy, 
    innerRadius, 
    outerRadius, 
    startAngle, 
    endAngle, 
    fill 
  } = props;
  
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
};

/**
 * Custom tooltip component styled for the Doughnut chart.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-[11px] animate-fade-in select-none">
        <p className="font-extrabold text-slate-950 dark:text-white uppercase tracking-wide">
          {data.name}
        </p>
        <p className="text-slate-550 dark:text-slate-400 mt-1 font-semibold">
          {data.value} {data.value === 1 ? 'Lead' : 'Leads'}
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-black text-xs mt-0.5">
          {data.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

/**
 * PieChartCard Component
 * Displays a doughnut chart depicting distribution of active/closed deals,
 * featuring interactive slice expansion and a center label showing total leads.
 */
export default function PieChartCard({ data = [], totalLeads = 0 }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  // Render empty state if there are no slices to show
  const hasData = data && data.length > 0;

  return (
    <div className="bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px]">
      
      {/* Panel Header */}
      <div>
        <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
          Lead Status Distribution
        </h3>
        <p className="text-[10px] text-slate-450 dark:text-slate-500">
          Volumetric breakdown of lead counts across pipeline lifecycle stages.
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-600 select-none">
          <Inbox size={28} className="mb-2 text-slate-300 dark:text-slate-700" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">No status metrics</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          
          {/* Doughnut Container (col-span-7) */}
          <div className="sm:col-span-7 relative h-48 w-full flex items-center justify-center">
            
            {/* Center Text Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-2xl font-display font-black text-slate-900 dark:text-white">
                {totalLeads}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Total Leads
              </span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="outline-none focus:outline-none transition-all duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Table (col-span-5) */}
          <div className="sm:col-span-5 space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
            {data.map((entry, index) => (
              <div 
                key={entry.name}
                className={`flex items-center justify-between py-1 px-1.5 rounded-lg border transition-all select-none ${
                  activeIndex === index
                    ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    : 'border-transparent'
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={onPieLeave}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span 
                    className="h-2 w-2 rounded-full shrink-0" 
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span className="font-semibold text-slate-650 dark:text-slate-350 truncate">
                    {entry.name}
                  </span>
                </div>
                
                <div className="font-display font-black text-slate-900 dark:text-white shrink-0 pl-1 text-[11px]">
                  {entry.value} <span className="text-slate-400 dark:text-slate-550 font-normal">({entry.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
