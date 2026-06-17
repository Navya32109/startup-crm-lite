import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * EmptyState Component
 * Displays a friendly message when no leads match the search/filter criteria.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.hasLeads - Whether there are any leads in total
 * @param {Function} props.onClearFilters - Callback to clear all filters
 * @returns {React.JSX.Element} The rendered EmptyState component
 */
export default function EmptyState({ hasLeads, onClearFilters }) {
  return (
    <div className="bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
      <Inbox className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={32} />
      <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-2">
        No leads found
      </p>
      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto mb-4">
        {hasLeads
          ? 'Try adjusting your search or filter criteria to find what you are looking for.'
          : 'Get started by adding your first lead to the pipeline.'
        }
      </p>
      {hasLeads && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold cursor-pointer transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
