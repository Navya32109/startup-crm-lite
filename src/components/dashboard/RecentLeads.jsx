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
        return 'bg-green-500/10 text-[#22C55E] border-green-500/20';
      case 'Lost':
        return 'bg-rose-500/10 text-[#EF4444] border-rose-500/20';
      case 'Negotiation':
        return 'bg-amber-500/10 text-[#F59E0B] border-amber-500/20';
      case 'Proposal':
        return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
      case 'Qualified':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'Contacted':
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      default:
        return 'bg-blue-500/10 text-[#2563EB] border-blue-500/20';
    }
  };

  return (
    <div className="bg-white dark:bg-[#13151d] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col h-full justify-between">
      <div className="mb-6">
        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
          Recent prospects
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          The last 5 deal acquisitions introduced into the CRM database
        </p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold">
              <th className="pb-3 pr-2">Prospect</th>
              <th className="pb-3 pr-2">Company</th>
              <th className="pb-3 pr-2">Stage Status</th>
              <th className="pb-3 text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/60 text-slate-700 dark:text-slate-350">
            {recentLeads.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-slate-400 select-none">
                  No active prospects found
                </td>
              </tr>
            ) : (
              recentLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/15 transition-colors group cursor-pointer"
                  onClick={() => onSelectLead && onSelectLead(lead.id)}
                >
                  {/* Lead Name with Hover highlighting */}
                  <td className="py-3.5 pr-2 font-bold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                  <td className="py-3.5 font-bold text-slate-900 dark:text-slate-200 text-right font-mono">
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
