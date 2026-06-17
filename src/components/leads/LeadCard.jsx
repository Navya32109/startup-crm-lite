import React from 'react';
import { Edit2, Trash2, Building2, Mail, Phone, DollarSign } from 'lucide-react';
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
 * @property {string} [phone] - The contact phone number.
 * @property {Note[]} notes - The chronological note objects.
 */

/**
 * @typedef {Object} LeadCardProps
 * @property {Lead} lead - The lead item record.
 * @property {function(Lead):void} onEditClick - Callback triggered when clicking the edit pencil icon button.
 * @property {function(string):void} onDeleteClick - Callback triggered when clicking the delete trash icon button.
 */

/**
 * LeadCard Component
 * Presents a single lead record in a cards-style grid format, incorporating
 * custom status pill badges, responsive details layouts, and click actions.
 * 
 * @param {LeadCardProps} props - The component parameters.
 * @returns {React.JSX.Element} The rendered lead card component.
 */
export default function LeadCard({ lead, onEditClick, onDeleteClick }) {
  return (
    <div className="bg-white dark:bg-[#13151d] border border-slate-205 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between min-h-[190px]">
      
      {/* Top row: Name and Actions */}
      <div className="space-y-1 flex-1">
        <div className="flex justify-between items-start gap-4">
          {/* Prospect Name & Company */}
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-950 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {lead.name}
            </h4>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              <Building2 size={12} className="shrink-0" />
              <span className="truncate">{lead.company}</span>
            </div>
          </div>

          {/* Inline Action Controls */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEditClick(lead)}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
              title="Edit Lead"
              aria-label={`Edit details for ${lead.name}`}
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => onDeleteClick(lead.id)}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
              title="Delete Lead"
              aria-label={`Delete ${lead.name} from records`}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Status Badge Row */}
        <div className="pt-3">
          <StatusBadge status={lead.status} />
        </div>

        {/* Contact info grid */}
        <div className="pt-4 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
          {/* Email Row */}
          <div className="flex items-center gap-2 min-w-0 font-mono">
            <Mail size={12} className="text-slate-450 dark:text-slate-500 shrink-0" />
            <span className="truncate select-all" title={lead.email}>{lead.email}</span>
          </div>

          {/* Phone Row */}
          {lead.phone && (
            <div className="flex items-center gap-2 min-w-0 font-mono">
              <Phone size={12} className="text-slate-450 dark:text-slate-500 shrink-0" />
              <span className="truncate">{lead.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer valuation row */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
          Valuation
        </span>
        <span className="text-xs font-black text-slate-900 dark:text-slate-200 font-mono">
          ${lead.value ? lead.value.toLocaleString() : '0'}
        </span>
      </div>

    </div>
  );
}
