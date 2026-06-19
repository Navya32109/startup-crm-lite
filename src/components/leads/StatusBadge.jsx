import React from 'react';

/**
 * @typedef {Object} StatusBadgeProps
 * @property {string} status - The current CRM status of the lead.
 */

/**
 * StatusBadge Component
 * Displays a styled semantic pill badge matching the specified lead status,
 * with adaptive theme-specific border strokes and background gradients.
 * 
 * @param {StatusBadgeProps} props - The component parameters.
 * @returns {React.JSX.Element} The rendered status badge.
 */
export default function StatusBadge({ status }) {
  /**
   * Helper utility to retrieve color mappings.
   * Aligns with the specified: Success (#22C55E) and Danger (#EF4444) color values.
   */
  const getBadgeClasses = (stage) => {
    const stageNormalized = stage ? stage.toLowerCase() : '';

    switch (stageNormalized) {
      case 'won':
        return 'bg-green-500/10 text-[#22C55E] border-green-500/20';
      case 'lost':
        return 'bg-rose-500/10 text-[#EF4444] border-rose-500/20';
      case 'meeting scheduled':
      case 'qualified':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'proposal sent':
      case 'proposal':
      case 'negotiation':
        return 'bg-amber-500/10 text-[#F59E0B] border-amber-500/20';
      case 'contacted':
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'new':
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20 dark:bg-gray-400/10 dark:text-gray-400';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide border uppercase select-none ${getBadgeClasses(status)}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
      <span>{status}</span>
    </span>
  );
}
