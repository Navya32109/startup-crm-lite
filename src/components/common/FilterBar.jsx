import React from 'react';

/**
 * FilterBar Component
 * A row of clickable filter buttons with lead counts for each status.
 * 
 * @param {Object} props - Component props
 * @param {string} props.activeFilter - Currently active filter
 * @param {Function} props.onFilterChange - Callback when filter changes
 * @param {Array} props.leads - Array of lead objects to calculate counts
 * @returns {React.JSX.Element} The rendered FilterBar component
 */
export default function FilterBar({ activeFilter, onFilterChange, leads }) {
  // Define filter options
  const filterOptions = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  // Calculate count for each filter
  const getCount = (filter) => {
    if (filter === 'All') return leads.length;
    return leads.filter(lead => lead.status === filter).length;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filterOptions.map((filter) => {
        const count = getCount(filter);
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {filter} ({count})
          </button>
        );
      })}
    </div>
  );
}
