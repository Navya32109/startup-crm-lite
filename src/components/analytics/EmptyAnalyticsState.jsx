import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Plus } from 'lucide-react';

/**
 * EmptyAnalyticsState Component
 * Displayed when there are no leads present in the CRM, encouraging the founder to create their first deal.
 */
export default function EmptyAnalyticsState() {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center shadow-sm select-none max-w-xl mx-auto my-12 animate-fade-in">
      <div className="mx-auto w-12 h-12 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-900/30">
        <BarChart3 size={24} />
      </div>
      
      <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-1">
        No analytics available yet
      </h3>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6 leading-relaxed">
        Add your first lead to start tracking business performance, conversion rates, and revenue forecasting.
      </p>
      
      <button
        onClick={() => navigate('/leads')}
        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-xl cursor-pointer shadow-md shadow-blue-500/10 active:scale-95 transition-all"
      >
        <Plus size={14} /> Add Lead
      </button>
    </div>
  );
}
