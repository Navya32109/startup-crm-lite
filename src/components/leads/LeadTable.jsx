import { Edit2, Trash2, Mail, Building2, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';

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
 * @typedef {Object} LeadTableProps
 * @property {Lead[]} leads - The list of CRM lead items.
 * @property {function(Lead):void} onEditClick - Callback triggered when clicking the edit pencil button.
 * @property {function(string):void} onDeleteClick - Callback triggered when clicking the delete trash button.
 */

/**
 * LeadTable Component
 * Displays CRM lead data records in a clean tabular format, suited for desktop viewports.
 * Each row includes action shortcuts to edit or remove the lead database records.
 * 
 * @param {LeadTableProps} props - The component parameters.
 * @returns {React.JSX.Element} The rendered lead table component.
 */
export default function LeadTable({ leads = [], onEditClick, onDeleteClick }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            {/* Headers row */}
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 text-gray-500 dark:text-gray-400 font-bold select-none">
              <th className="p-4">Name</th>
              <th className="p-4">Company</th>
              <th className="p-4">Stage Status</th>
              <th className="p-4 hidden lg:table-cell">Email Address</th>
              <th className="p-4 hidden lg:table-cell">Source</th>
              <th className="p-4 text-right">Value</th>
              <th className="p-4 hidden lg:table-cell">Created Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-150 dark:divide-gray-700 text-gray-755 dark:text-gray-300">
            {leads.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-400 select-none">
                  No prospects matched the current filters.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-gray-50/70 dark:hover:bg-gray-900/10 transition-colors group"
                >
                  {/* Name */}
                  <td className="p-4 font-bold text-gray-900 dark:text-white">
                    {lead.name}
                  </td>
                  
                  {/* Company */}
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={12} className="text-gray-400 shrink-0" />
                      <span>{lead.company}</span>
                    </div>
                  </td>
                  
                  {/* Status Badge */}
                  <td className="p-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  
                  {/* Email */}
                  <td className="p-4 font-mono select-all text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Mail size={12} className="text-gray-400 shrink-0" />
                      <span>{lead.email}</span>
                    </div>
                  </td>
                  
                  {/* Source */}
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-900 text-gray-400 border border-gray-200 dark:border-gray-700">
                      {lead.source}
                    </span>
                  </td>

                  {/* Value */}
                  <td className="p-4 font-bold text-gray-900 dark:text-white text-right font-mono">
                    ${lead.value ? lead.value.toLocaleString() : '0'}
                  </td>
                  
                  {/* Date Created */}
                  <td className="p-4 text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-gray-400 shrink-0" />
                      <span>{lead.createdDate}</span>
                    </div>
                  </td>
                  
                  {/* Inline Action Button Options */}
                  <td className="p-2 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEditClick(lead)}
                        className="w-11 h-11 lg:w-8 lg:h-8 flex items-center justify-center text-gray-450 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                        title="Edit Details"
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Edit2 size={15} className="lg:size-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClick(lead.id)}
                        className="w-11 h-11 lg:w-8 lg:h-8 flex items-center justify-center text-gray-455 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                        title="Delete Lead"
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 size={15} className="lg:size-3.5" />
                      </button>
                    </div>
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
