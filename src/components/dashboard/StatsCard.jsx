import React from 'react';

/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - The display label of the metric card (e.g. "Total Leads").
 * @property {string|number} value - The visual numeric display value (e.g. "$128,000").
 * @property {React.ComponentType<{className?: string}>} icon - The Lucide React icon component class to render.
 * @property {string} change - The comparative percentage change label (e.g. "+14.8%").
 * @property {'primary'|'success'|'warning'|'danger'} color - The semantic theme color category defining card accent classes.
 */

/**
 * StatsCard Component
 * Displays high-level CRM indicators with styled Lucide icons, responsive card canvases,
 * subtle background gradients on hover, and light/dark theme adaptation.
 * 
 * @param {StatsCardProps} props - The component parameters.
 * @returns {React.JSX.Element} The rendered stats card UI.
 */
export default function StatsCard({ title, value, icon: Icon, change, color }) {
  // Define mapping for colors to match specified hex codes:
  // Primary: #2563EB (blue), Success: #22C55E (emerald), Warning: #F59E0B (amber), Danger: #EF4444 (rose)
  const colorMap = {
    primary: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/5',
      text: 'text-[#2563EB]',
      border: 'border-blue-500/10 dark:border-blue-500/20',
      hoverGlow: 'group-hover:border-blue-500/30 dark:group-hover:border-blue-500/40',
      gradient: 'from-blue-500 to-indigo-600',
    },
    success: {
      bg: 'bg-[#22C55E]/10 dark:bg-[#22C55E]/5',
      text: 'text-[#22C55E]',
      border: 'border-[#22C55E]/10 dark:border-[#22C55E]/20',
      hoverGlow: 'group-hover:border-[#22C55E]/30 dark:group-hover:border-[#22C55E]/40',
      gradient: 'from-[#22C55E] to-teal-500',
    },
    warning: {
      bg: 'bg-[#F59E0B]/10 dark:bg-[#F59E0B]/5',
      text: 'text-[#F59E0B]',
      border: 'border-[#F59E0B]/10 dark:border-[#F59E0B]/20',
      hoverGlow: 'group-hover:border-[#F59E0B]/30 dark:group-hover:border-[#F59E0B]/40',
      gradient: 'from-[#F59E0B] to-orange-500',
    },
    danger: {
      bg: 'bg-[#EF4444]/10 dark:bg-[#EF4444]/5',
      text: 'text-[#EF4444]',
      border: 'border-[#EF4444]/10 dark:border-[#EF4444]/20',
      hoverGlow: 'group-hover:border-[#EF4444]/30 dark:group-hover:border-[#EF4444]/40',
      gradient: 'from-[#EF4444] to-red-600',
    },
  };

  const activeColor = colorMap[color] || colorMap.primary;
  const isPositive = !change.startsWith('-');

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white p-6 shadow-sm transition-all duration-300 dark:bg-gray-800 group hover:shadow-md ${activeColor.border} ${activeColor.hoverGlow}`}>
      {/* Decorative top corner hover glow circle */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-slate-100/10 dark:to-white/5 rounded-full pointer-events-none transition-opacity duration-300"></div>

      <div className="flex justify-between items-start">
        <div className="space-y-2">
          {/* Card Label Title */}
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
            {title}
          </span>
          {/* Card Value Metric */}
          <p className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            {value}
          </p>
        </div>
        {/* Metric Icon Container Wrapper */}
        <div className={`p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${activeColor.bg} ${activeColor.text}`}>
          <Icon className="h-5 w-5 shrink-0" />
        </div>
      </div>

      {/* Metric Percentage change and Subtext */}
      <div className="mt-4 flex items-center gap-1.5 text-xs">
        <span className={`font-semibold px-2 py-0.5 rounded-full ${
          isPositive 
            ? 'bg-green-500/10 text-[#22C55E] dark:bg-green-500/5' 
            : 'bg-rose-500/10 text-[#EF4444] dark:bg-rose-500/5'
        }`}>
          {change}
        </span>
        <span className="text-slate-400 dark:text-slate-500 font-medium">vs last month</span>
      </div>

      {/* Decorative bottom hover bar line */}
      <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${activeColor.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
    </div>
  );
}
