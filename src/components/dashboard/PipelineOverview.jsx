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
 * @property {Note[]} notes - The chronological note objects.
 */

/**
 * @typedef {Object} PipelineOverviewProps
 * @property {Lead[]} leads - The list of CRM lead data objects.
 */

/**
 * PipelineOverview Component
 * Renders a segmented horizontal visualization bar showing proportional
 * valuations across different deal lifecycle stages.
 * 
 * @param {PipelineOverviewProps} props - The component parameters.
 * @returns {React.JSX.Element} The rendered pipeline overview.
 */
export default function PipelineOverview({ leads = [] }) {
  // Define CRM stages in logical progression order
  const stages = [
    { key: 'New', label: 'New', colorBg: 'bg-[#2563EB]', colorText: 'text-[#2563EB]' },
    { key: 'Contacted', label: 'Contacted', colorBg: 'bg-indigo-500', colorText: 'text-indigo-500' },
    { key: 'Qualified', label: 'Qualified', colorBg: 'bg-purple-500', colorText: 'text-purple-500' },
    { key: 'Proposal', label: 'Proposal', colorBg: 'bg-pink-500', colorText: 'text-pink-500' },
    { key: 'Negotiation', label: 'Negotiation', colorBg: 'bg-[#F59E0B]', colorText: 'text-[#F59E0B]' },
    { key: 'Won', label: 'Won', colorBg: 'bg-[#22C55E]', colorText: 'text-[#22C55E]' },
    { key: 'Lost', label: 'Lost', colorBg: 'bg-[#EF4444]', colorText: 'text-[#EF4444]' }
  ];

  // Calculate sum total valuation of active leads (excluding Lost deals from pipeline target value)
  const totalValuation = leads
    .filter(lead => lead.status !== 'Lost')
    .reduce((sum, lead) => sum + lead.value, 0);

  // Group metrics by stage
  const stageMetrics = stages.map(stage => {
    const stageLeads = leads.filter(lead => lead.status === stage.key);
    const count = stageLeads.length;
    const value = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
    // Calculate percentage based on deal value relative to total active pipeline
    const percentage = totalValuation > 0 && stage.key !== 'Lost' 
      ? Math.round((value / totalValuation) * 100) 
      : 0;

    return {
      ...stage,
      count,
      value,
      percentage
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="font-display font-bold text-base text-gray-900 dark:text-white">
            Pipeline stage overview
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Valuation density distributed across active CRM deal flows
          </p>
        </div>
        <div className="text-right">
          <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Active Pipeline Value
          </span>
          <span className="text-lg font-black text-gray-900 dark:text-white font-mono">
            ${totalValuation.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Segmented Horizontal Progress Bar */}
      <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full flex overflow-hidden shadow-inner mb-6">
        {totalValuation === 0 ? (
          <div className="h-full w-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
        ) : (
          stageMetrics
            .filter(metric => metric.key !== 'Lost' && metric.value > 0)
            .map(metric => (
              <div
                key={metric.key}
                className={`${metric.colorBg} h-full transition-all duration-500 hover:opacity-90 cursor-help`}
                style={{ width: `${(metric.value / totalValuation) * 100}%` }}
                title={`${metric.label}: $${metric.value.toLocaleString()} (${metric.percentage}%)`}
              />
            ))
        )}
      </div>

      {/* Stage Detail Grid Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {stageMetrics.map(metric => (
          <div 
            key={metric.key} 
            className="p-3 bg-gray-50/50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700/60 rounded-xl space-y-1 transition-all hover:bg-gray-100/40 dark:hover:bg-gray-900/50"
          >
            {/* Color Indicator Dot and Title */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`h-2 w-2 rounded-full shrink-0 ${metric.colorBg}`}></span>
              <span className="text-[10px] font-bold text-gray-750 dark:text-gray-300 truncate">
                {metric.label}
              </span>
            </div>

            {/* Counts Badge and Value */}
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-gray-900 dark:text-white font-mono truncate">
                ${metric.value.toLocaleString()}
              </p>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 block">
                {metric.count} {metric.count === 1 ? 'lead' : 'leads'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
