import React from 'react';

/**
 * @typedef {Object} Note
 * @property {string} id - The note unique identifier.
 * @property {string} date - The creation date.
 * @property {string} text - The content text.
 * @property {string} author - The staff author.
 */

/**
 * @typedef {Object} Lead
 * @property {string} id - The lead identifier.
 * @property {string} name - The prospect name.
 * @property {string} company - The company name.
 * @property {string} email - The email address.
 * @property {string} status - The lifecycle status of the lead.
 * @property {number} value - The projected financial valuation of the deal.
 * @property {string} priority - The priority category.
 * @property {string} source - The marketing channel source.
 * @property {string} createdDate - The creation date (YYYY-MM-DD).
 * @property {Note[]} notes - The chronological note objects.
 */

/**
 * @typedef {Object} RecentLeadsProps
 * @property {Lead[]} leads - The list of CRM lead data objects.
 * @property {function(string):void} onSelectLead - Optional callback when clicking a lead name.
 */

/**
 * RecentLeads Component
 * Renders a high-density, Notion-inspired list table presenting the top 5 most
 * recently registered sales deal opportunities.
 * 
 * @param {RecentLeadsProps} props - The component parameters.
 * @returns {React.JSX.Element} The rendered recent leads card list.
 */
export default function RecentLeads({ leads = [], onSelectLead }) {
  // Sort leads by createdDate descending, falls back to id timestamp sorting
  const recentLeads = [...leads]
    .sort((a, b) => b.createdDate.localeCompare(a.createdDate) || b.id.localeCompare(a.id))
    .slice(0, 5);

  /**
   * Helper utility to resolve appropriate style classes for status badges.
   * Accents match requested Success (#22C55E) and Danger (#EF4444) color values.
   * 
   * @param {string} status - The lead status code.
   * @returns {string} Tailwind color style classes.
   */
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Won':
        return 'bg-green-500/10 text-[#22C55E] dark:text-[#4ADE80] border-green-500/20';
      case 'Lost':
        return 'bg-rose-500/10 text-[#EF4444] dark:text-[#F87171] border-rose-500/20';
      case 'Negotiation':
      case 'Proposal':
        return 'bg-orange-500/10 text-[#FF8F5A] dark:text-[#FFA26E] border-orange-500/20';
      case 'Qualified':
      case 'Meeting Scheduled':
        return 'bg-blue-500/10 text-[#5E81F4] dark:text-[#9EB4FF] border-blue-500/20';
      case 'Contacted':
        return 'bg-blue-600/10 text-[#3B5CCC] dark:text-[#6C8DFF] border-blue-600/20';
      default:
        return 'bg-gray-500/10 text-[#5B6475] dark:text-[#CBD5E1] border-gray-500/20';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col h-full justify-between">
      <div className="mb-6">
        <h3 className="font-display font-bold text-base text-gray-900 dark:text-white">
          Recent prospects
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          The last 5 deal acquisitions introduced into the CRM database
        </p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold">
              <th className="pb-3 pr-2">Prospect</th>
              <th className="pb-3 pr-2">Company</th>
              <th className="pb-3 pr-2">Stage Status</th>
              <th className="pb-3 text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/60 dark:divide-gray-700/60 text-gray-700 dark:text-gray-300">
            {recentLeads.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-gray-400 select-none">
                  No active prospects found
                </td>
              </tr>
            ) : (
              recentLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-900/15 transition-colors group cursor-pointer"
                  onClick={() => onSelectLead && onSelectLead(lead.id)}
                >
                  {/* Lead Name with Hover highlighting */}
                  <td className="py-3.5 pr-2 font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {lead.name}
                  </td>
                  {/* Company */}
                  <td className="py-3.5 pr-2 truncate max-w-[120px]">
                    {lead.company}
                  </td>
                  {/* Status Badge */}
                  <td className="py-3.5 pr-2">
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  {/* Deal Value */}
                  <td className="py-3.5 font-bold text-gray-900 dark:text-white text-right font-mono">
                    ${lead.value.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
