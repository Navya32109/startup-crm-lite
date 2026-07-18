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
        return 'bg-green-500/10 text-[#22C55E] dark:text-[#4ADE80] border-green-500/20';
      case 'lost':
        return 'bg-rose-500/10 text-[#EF4444] dark:text-[#F87171] border-rose-500/20';
      case 'meeting scheduled':
      case 'qualified':
        return 'bg-blue-500/10 text-[#5E81F4] dark:text-[#9EB4FF] border-blue-500/20';
      case 'proposal sent':
      case 'proposal':
      case 'negotiation':
        return 'bg-orange-500/10 text-[#FF8F5A] dark:text-[#FFA26E] border-orange-500/20';
      case 'contacted':
        return 'bg-blue-600/10 text-[#3B5CCC] dark:text-[#6C8DFF] border-blue-600/20';
      case 'new':
      default:
        return 'bg-gray-500/10 text-[#5B6475] dark:text-[#CBD5E1] border-gray-500/20';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide border uppercase select-none ${getBadgeClasses(status)}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
      <span>{status}</span>
    </span>
  );
}
