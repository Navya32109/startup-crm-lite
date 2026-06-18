import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * AnalyticsFilters Component
 * Renders the time range selectors (7 Days, 30 Days, 90 Days, This Year, Custom).
 * Dynamically displays date inputs for custom start and end bounds when selected.
 */
export default function AnalyticsFilters({
  timeRange,
  setTimeRange,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate
}) {
  const filterOptions = [
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Description inside filter bar */}
        <div className="flex items-center gap-2">
          <Calendar className="text-blue-600 dark:text-blue-400 shrink-0" size={16} />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Filter Period
          </span>
        </div>

        {/* Filter Buttons group */}
        <div className="flex flex-wrap items-center gap-1.5 p-0.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                timeRange === option.value
                  ? 'bg-white dark:bg-[#13151d] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/20 dark:border-slate-800/40'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Pickers for Custom Range */}
      {timeRange === 'custom' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-850/60 animate-slide-down text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500/80 text-slate-700 dark:text-slate-250 cursor-pointer transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
              End Date
            </label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500/80 text-slate-700 dark:text-slate-250 cursor-pointer transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}
