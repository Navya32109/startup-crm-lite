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
    <div className="bg-white dark:bg-[#13151d] border border-slate-205 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm select-none animate-fade-in">
      <Inbox className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={32} />
      <p className="font-bold text-slate-750 dark:text-slate-200 text-sm mb-1">
        {hasLeads ? 'No leads found' : 'No leads in pipeline yet'}
      </p>
      <p className="text-xs text-slate-450 dark:text-slate-500 max-w-xs mx-auto mb-4 leading-relaxed">
        {hasLeads
          ? 'Try adjusting your search or filter criteria or clear them to find what you are looking for.'
          : 'Get started by adding your first lead to the sales funnel pipeline.'
        }
      </p>
      {hasLeads && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold cursor-pointer transition-colors px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
