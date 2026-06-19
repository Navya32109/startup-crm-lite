import React from 'react';
import { Plus, Users, Download } from 'lucide-react';

/**
 * @typedef {Object} QuickActionsProps
 * @property {function():void} onAddLeadClick - Callback triggered when clicking "Add New Lead".
 * @property {function():void} onViewAllClick - Callback triggered when clicking "View All Leads".
 * @property {function():void} onExportClick - Callback triggered when clicking "Export Data".
 */

/**
 * QuickActions Component
 * Provides primary shortcuts for common CRM activities, with modern
 * icons and interactive scale transformations.
 * 
 * @param {QuickActionsProps} props - The component parameters.
 * @returns {React.JSX.Element} The rendered quick action buttons panel.
 */
export default function QuickActions({ onAddLeadClick, onViewAllClick, onExportClick }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm flex flex-col h-full justify-between">
      <div className="mb-6">
        <h3 className="font-display font-bold text-base text-gray-900 dark:text-white">
          Quick workflow
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Core database actions to expedite lead prospecting operations
        </p>
      </div>

      <div className="space-y-3 flex-1 flex flex-col justify-center">
        {/* Action 1: Add New Lead */}
        <button
          onClick={onAddLeadClick}
          className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 transition-all"
        >
          <Plus size={16} />
          <span>Add New Lead</span>
        </button>

        {/* Action 2: View All Leads */}
        <button
          onClick={onViewAllClick}
          className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-semibold py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Users size={16} className="text-gray-400 dark:text-gray-500" />
          <span>View All Leads</span>
        </button>

        {/* Action 3: Export Data */}
        <button
          onClick={onExportClick}
          className="w-full bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900/40 text-gray-550 dark:text-gray-400 text-xs font-semibold py-3 px-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Download size={16} />
          <span>Export CRM CSV</span>
        </button>
      </div>
    </div>
  );
}
