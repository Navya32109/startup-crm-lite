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
    <div className="bg-white dark:bg-gray-800 border border-gray-205 dark:border-gray-700 rounded-2xl p-12 text-center shadow-sm select-none animate-fade-in">
      <Inbox className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={32} />
      <p className="font-bold text-gray-700 dark:text-gray-200 text-sm mb-1">
        {hasLeads ? 'No leads found' : 'No leads in pipeline yet'}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-450 max-w-xs mx-auto mb-4 leading-relaxed">
        {hasLeads
          ? 'Try adjusting your search or filter criteria or clear them to find what you are looking for.'
          : 'Get started by adding your first lead to the sales funnel pipeline.'
        }
      </p>
      {hasLeads && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold cursor-pointer transition-colors px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
