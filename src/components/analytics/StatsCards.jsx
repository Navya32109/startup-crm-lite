import React from 'react';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  XCircle, 
  Percent, 
  Layers, 
  Trophy,
  Minus
} from 'lucide-react';

/**
 * Helper to format Indian Rupee values (e.g. ₹12,40,000)
 */
const formatINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Helper to calculate growth percentage relative to the previous period.
 */
const getGrowth = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * StatsCards Component
 * Renders 6 KPI panels displaying total leads, conversion rates, pipeline sizes,
 * won revenue, average cycle days, and lost rate percentages.
 */
export default function StatsCards({ stats, prevStats }) {
  // 1. Total Leads
  const totalLeadsGrowth = getGrowth(stats.totalLeads, prevStats.totalLeads);
  
  // 2. Conversion Rate
  const conversionRateDiff = stats.conversionRate - prevStats.conversionRate; // absolute point difference

  // 3. Pipeline Value
  const pipelineValueGrowth = getGrowth(stats.pipelineValue, prevStats.pipelineValue);

  // 4. Won Revenue
  const wonRevenueGrowth = getGrowth(stats.wonRevenue, prevStats.wonRevenue);

  // 5. Sales Cycle (lower is better, so positive growth = negative change in days)
  const salesCycleDiff = stats.avgSalesCycle - prevStats.avgSalesCycle;

  // 6. Lost Rate (lower is better)
  const lostRateDiff = stats.lostRate - prevStats.lostRate;

  const kpis = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      iconBg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400',
      change: totalLeadsGrowth,
      changeType: totalLeadsGrowth > 0 ? 'positive' : totalLeadsGrowth < 0 ? 'negative' : 'neutral',
      formatType: 'number',
      label: 'vs prev period'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: Percent,
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400',
      change: conversionRateDiff,
      changeType: conversionRateDiff > 0 ? 'positive' : conversionRateDiff < 0 ? 'negative' : 'neutral',
      formatType: 'rate',
      label: 'vs prev period'
    },
    {
      title: 'Pipeline Value',
      value: formatINR(stats.pipelineValue),
      icon: Layers,
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400',
      change: pipelineValueGrowth,
      changeType: pipelineValueGrowth > 0 ? 'positive' : pipelineValueGrowth < 0 ? 'negative' : 'neutral',
      formatType: 'currency',
      label: 'vs prev period'
    },
    {
      title: 'Won Revenue',
      value: formatINR(stats.wonRevenue),
      icon: Trophy,
      iconBg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400',
      change: wonRevenueGrowth,
      changeType: wonRevenueGrowth > 0 ? 'positive' : wonRevenueGrowth < 0 ? 'negative' : 'neutral',
      formatType: 'currency',
      label: 'vs prev period'
    },
    {
      title: 'Average Sales Cycle',
      value: `${stats.avgSalesCycle} Days`,
      icon: Clock,
      iconBg: 'bg-violet-500/10 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400',
      change: salesCycleDiff,
      // Lower days is positive performance
      changeType: salesCycleDiff < 0 ? 'positive' : salesCycleDiff > 0 ? 'negative' : 'neutral',
      formatType: 'days',
      label: 'vs prev period'
    },
    {
      title: 'Lost Rate',
      value: `${stats.lostRate}%`,
      icon: XCircle,
      iconBg: 'bg-rose-500/10 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400',
      change: lostRateDiff,
      // Lower rate is positive performance
      changeType: lostRateDiff < 0 ? 'positive' : lostRateDiff > 0 ? 'negative' : 'neutral',
      formatType: 'rate',
      label: 'vs prev period'
    }
  ];

  const renderGrowthBadge = (kpi) => {
    const isRateOrDays = kpi.formatType === 'rate' || kpi.formatType === 'days';
    const num = Math.abs(kpi.change);
    const suffix = isRateOrDays ? '%' : '%';
    const text = isRateOrDays ? `${kpi.change > 0 ? '+' : ''}${kpi.change}% points` : `${kpi.change > 0 ? '+' : ''}${kpi.change}%`;

    if (kpi.changeType === 'positive') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
          <TrendingUp size={10} />
          {text}
        </span>
      );
    }
    if (kpi.changeType === 'negative') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/10">
          <TrendingDown size={10} />
          {text}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-500/15 text-slate-500 dark:text-slate-400 border border-slate-500/10">
        <Minus size={10} />
        0%
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {kpis.map((kpi, idx) => {
        const IconComponent = kpi.icon;
        return (
          <div 
            key={idx}
            className="bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">
                {kpi.title}
              </span>
              <div className={`p-2 rounded-xl shrink-0 transition-transform group-hover:scale-110 duration-300 ${kpi.iconBg}`}>
                <IconComponent size={16} />
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                {kpi.value}
              </p>
              
              <div className="flex items-center gap-1.5 mt-2">
                {renderGrowthBadge(kpi)}
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                  {kpi.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
