import React, { useState, useRef } from 'react';
import { Calendar, Info } from 'lucide-react';

/**
 * ActivityHeatmap Component
 * Renders a rolling 16-week contribution calendar tracking daily sales activities:
 * - Leads Created
 * - Meetings Scheduled
 * - Contacted Calls Logged
 */
export default function ActivityHeatmap({ data = {} }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const containerRef = useRef(null);

  // Generate cells grid: rolling 16 weeks of columns
  const today = new Date();
  const todayDay = today.getDay();
  
  // Align grid to start on a Sunday
  const currentSunday = new Date(today);
  currentSunday.setDate(today.getDate() - todayDay);
  currentSunday.setHours(0, 0, 0, 0);

  const startSunday = new Date(currentSunday);
  startSunday.setDate(startSunday.getDate() - 15 * 7); // 16 weeks total (index 0 to 15)

  const weeks = [];
  let currentWeek = [];
  const tempDate = new Date(startSunday);

  // Loop through days until we cover all 16 weeks (112 days) up to today's week end
  const totalDaysToRender = 16 * 7;
  for (let i = 0; i < totalDaysToRender; i++) {
    const dateKey = tempDate.toISOString().split('T')[0];
    const activity = data[dateKey] || { count: 0, details: { created: 0, meetings: 0, calls: 0 } };
    
    currentWeek.push({
      date: new Date(tempDate),
      dateKey,
      count: activity.count,
      details: activity.details
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    tempDate.setDate(tempDate.getDate() + 1);
  }

  // Determine cell color based on activity density
  const getCellColorClass = (count) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-850 border-transparent';
    if (count <= 2) return 'bg-blue-500/20 dark:bg-blue-500/25 border-blue-500/10';
    if (count <= 4) return 'bg-blue-500/45 dark:bg-blue-500/50 border-blue-500/20';
    if (count <= 6) return 'bg-blue-500/70 dark:bg-blue-500/75 border-blue-500/30';
    return 'bg-blue-600 dark:bg-blue-500 border-blue-600/40';
  };

  // Find month boundaries to render header labels
  const monthLabels = [];
  weeks.forEach((week, wIdx) => {
    const firstDay = week[0].date;
    const monthName = firstDay.toLocaleString('default', { month: 'short' });
    
    if (wIdx === 0 || firstDay.getDate() <= 7) {
      monthLabels.push({ text: monthName, index: wIdx });
    }
  });

  const handleMouseEnter = (cell, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Position tooltip above the hovered square relative to parent container
    setHoveredCell({
      ...cell,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 6
    });
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div className="bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px]">
      
      {/* Panel Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
            Activity Heatmap
          </h3>
          <p className="text-[10px] text-slate-450 dark:text-slate-500">
            Daily logs of leads added, meetings, and outbound client communication logs.
          </p>
        </div>
        <div className="text-slate-400 hover:text-slate-550 cursor-pointer" title="Green represents more activities logged on that calendar date">
          <Info size={14} />
        </div>
      </div>

      {/* Heatmap Grid Frame */}
      <div 
        ref={containerRef} 
        className="relative my-auto py-2 overflow-x-auto text-[10px] select-none scrollbar-thin"
      >
        <div className="min-w-[420px] flex flex-col gap-1.5 pt-4">
          
          {/* Months Row */}
          <div className="flex pl-8 h-4 relative">
            {monthLabels.map((lbl, idx) => (
              <span 
                key={idx} 
                className="absolute font-semibold text-slate-400 text-[9px] uppercase tracking-wider"
                style={{ left: `${32 + lbl.index * 24}px` }}
              >
                {lbl.text}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            
            {/* Days Column Labels */}
            <div className="flex flex-col justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500 w-6 h-28 pr-1 uppercase text-right py-0.5">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>

            {/* Weeks Columns */}
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((cell) => {
                    const isFuture = cell.date > today;
                    return (
                      <div
                        key={cell.dateKey}
                        onMouseEnter={(e) => !isFuture && handleMouseEnter(cell, e)}
                        onMouseLeave={handleMouseLeave}
                        className={`w-3.5 h-3.5 rounded border transition-all duration-200 ${
                          isFuture 
                            ? 'bg-slate-50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-850/20 cursor-not-allowed' 
                            : `${getCellColorClass(cell.count)} border hover:scale-125 hover:border-slate-400/50 dark:hover:border-slate-500 cursor-pointer`
                        }`}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Floating Custom Tooltip */}
        {hoveredCell && (
          <div 
            className="absolute bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 p-3 rounded-xl shadow-xl text-[10px] w-48 z-10 pointer-events-none transition-all duration-150 animate-scale-up"
            style={{
              left: `${hoveredCell.x}px`,
              top: `${hoveredCell.y}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            {/* Arrow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 bg-white dark:bg-slate-950 border-r border-b border-slate-200 dark:border-slate-800 rotate-45"></div>

            <p className="font-extrabold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-1.5">
              {hoveredCell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <div className="mt-1.5 space-y-1 text-slate-600 dark:text-slate-400 font-semibold">
              <div className="flex justify-between">
                <span>Leads Created:</span>
                <span className="font-black text-blue-600 dark:text-blue-400">{hoveredCell.details.created}</span>
              </div>
              <div className="flex justify-between">
                <span>Meetings Scheduled:</span>
                <span className="font-black text-amber-600 dark:text-amber-400">{hoveredCell.details.meetings}</span>
              </div>
              <div className="flex justify-between">
                <span>Communication Logs:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">{hoveredCell.details.calls}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 dark:border-slate-850 pt-1 mt-1 text-[11px] font-bold text-slate-900 dark:text-white">
                <span>Total Actions:</span>
                <span>{hoveredCell.count}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Heatmap Legend */}
      <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-semibold select-none pt-2 border-t border-slate-100 dark:border-slate-850/60">
        <span>Recent 16 Weeks Activity</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded bg-slate-100 dark:bg-slate-850"></span>
          <span className="w-2.5 h-2.5 rounded bg-blue-500/20 dark:bg-blue-500/25"></span>
          <span className="w-2.5 h-2.5 rounded bg-blue-500/45 dark:bg-blue-500/50"></span>
          <span className="w-2.5 h-2.5 rounded bg-blue-500/70 dark:bg-blue-500/75"></span>
          <span className="w-2.5 h-2.5 rounded bg-blue-600 dark:bg-blue-500"></span>
          <span>More</span>
        </div>
      </div>

    </div>
  );
}
