import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

/**
 * Helper to format Indian Rupee values.
 */
const formatINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * SalesVelocityCard Component
 * Displays the sales velocity rate (₹/day) indicating how quickly revenue flows through the pipeline.
 * Formulates: (Opportunities × Win Rate × Avg Deal Size) ÷ Sales Cycle Length.
 */
export default function SalesVelocityCard({ data = {}, prevData = {} }) {
  const { 
    velocity = 0, 
    opportunities = 0, 
    winRate = 0, 
    avgDealSize = 0, 
    salesCycle = 14 
  } = data;

  const prevVelocity = prevData?.velocity || 0;
  
  // Calculate growth rate
  const growth = prevVelocity > 0 
    ? Math.round(((velocity - prevVelocity) / prevVelocity) * 100) 
    : (velocity > 0 ? 100 : 0);

  const renderTrendBadge = () => {
    if (growth > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 shrink-0">
          <TrendingUp size={10} />
          +{growth}%
        </span>
      );
    }
    if (growth < 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/10 shrink-0">
          <TrendingDown size={10} />
          {growth}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-500/15 text-slate-500 dark:text-slate-400 border border-slate-500/10 shrink-0">
        <Minus size={10} />
        0%
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px] relative overflow-hidden group">
      
      {/* Background Glow Effect */}
      <div className="absolute -right-12 -top-12 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>

      {/* Card Header */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm">
              Sales Velocity Index
            </h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              Rate of pipeline conversion measured in average revenue realized per day.
            </p>
          </div>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 shrink-0">
            <Activity size={16} />
          </div>
        </div>

        {/* Main Indicator */}
        <div className="mt-4 flex items-baseline gap-2 select-none">
          <span className="text-2xl font-display font-black text-gray-900 dark:text-white tracking-tight">
            {formatINR(velocity)}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">
            / Day
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1.5 select-none">
          {renderTrendBadge()}
          <span className="text-[9px] text-gray-450 dark:text-gray-500 font-medium">
            vs previous period
          </span>
        </div>
      </div>

      {/* Equation Variables Subgrid */}
      <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-auto select-none text-[11px]">
        <div className="grid grid-cols-2 gap-4">
          
          <div className="space-y-1">
            <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
              Opportunities (O)
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {opportunities} Deals
            </span>
          </div>

          <div className="space-y-1">
            <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
              Win Rate (WR)
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {winRate}%
            </span>
          </div>

          <div className="space-y-1">
            <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
              Avg Deal Size (L)
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {formatINR(avgDealSize)}
            </span>
          </div>

          <div className="space-y-1">
            <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
              Sales Cycle (C)
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {salesCycle} Days
            </span>
          </div>

        </div>
      </div>

      {/* Equation Explainer Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold select-none pt-2">
        <span className="flex items-center gap-1">
          <HelpCircle size={11} className="text-slate-350 dark:text-slate-600" />
          Formula: (O × WR × L) ÷ C
        </span>
        <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-0.5">
          Read Guide <ArrowRight size={10} />
        </span>
      </div>

    </div>
  );
}
