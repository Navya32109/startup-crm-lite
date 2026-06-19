import React from 'react';
import { Trophy, Award, User, Star, Inbox } from 'lucide-react';

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
 * Helper to get initials of a name.
 */
const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

/**
 * TopPerformersCard Component
 * Renders a ranked list of sales reps/owners sorting by cumulative closed-won revenue values.
 */
export default function TopPerformersCard({ data = [] }) {
  // Filter out reps who have 0 won revenue to focus on performance
  const activePerformers = data.filter(rep => rep.wonRevenue > 0);
  const hasData = activePerformers.length > 0;

  // Colors for rank badges
  const getRankBadgeClass = (index) => {
    switch (index) {
      case 0:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-450 border-amber-200/50'; // Gold
      case 1:
        return 'bg-gray-200/60 text-gray-700 dark:bg-gray-700/60 dark:text-gray-400 border-gray-305/30'; // Silver
      case 2:
        return 'bg-amber-700/10 text-amber-800 dark:bg-amber-900/10 dark:text-amber-500 border-amber-800/10'; // Bronze
      default:
        return 'bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-450 border-gray-200/10';
    }
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy size={14} className="text-amber-500 shrink-0" />;
    if (index === 1) return <Award size={14} className="text-gray-400 shrink-0" />;
    if (index === 2) return <Award size={14} className="text-amber-700 shrink-0" />;
    return <User size={13} className="text-gray-400 shrink-0" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px]">
      
      {/* Panel Header */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm">
              Top Sales Performers
            </h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              Ranked listing of sales representatives by total won revenue closed.
            </p>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450 shrink-0">
            <Trophy size={16} />
          </div>
        </div>
      </div>

      {/* Performers List Frame */}
      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-650 select-none my-auto">
          <Inbox size={28} className="mb-2 text-gray-300 dark:text-gray-700" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-450">No sales reps ranked</span>
        </div>
      ) : (
        <div className="space-y-3 my-auto overflow-y-auto max-h-[220px] pr-1 scrollbar-thin py-2">
          {activePerformers.map((rep, index) => (
            <div 
              key={rep.name}
              className="flex items-center justify-between p-2.5 bg-gray-50/50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700/60 rounded-xl select-none hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
            >
              <div className="flex items-center gap-3 truncate">
                {/* Rank Badge */}
                <div className={`w-6 h-6 rounded-lg border font-bold flex items-center justify-center text-[11px] shrink-0 ${getRankBadgeClass(index)}`}>
                  {index + 1}
                </div>

                {/* Avatar Icon */}
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-black border border-blue-100 dark:border-blue-900/30 shrink-0">
                  {getInitials(rep.name)}
                </div>

                {/* Rep Details */}
                <div className="truncate">
                  <span className="block font-bold text-gray-800 dark:text-gray-200 text-[11px] truncate">
                    {rep.name}
                  </span>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold block">
                    {rep.wonCount} {rep.wonCount === 1 ? 'deal won' : 'deals won'} ({rep.totalCount} total)
                  </span>
                </div>
              </div>

              {/* Revenue Closed */}
              <div className="text-right shrink-0 pl-2">
                <span className="block font-display font-black text-gray-900 dark:text-white text-xs">
                  {formatINR(rep.wonRevenue)}
                </span>
                {index === 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[8px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                    <Star size={8} className="fill-current" /> MVP Leader
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      <div className="flex justify-between items-center text-[10px] text-gray-450 dark:text-gray-500 font-semibold select-none pt-2 border-t border-gray-200 dark:border-gray-700">
        <span>Metric: Closed Deals Value</span>
        <span className="flex items-center gap-0.5">
          {getRankIcon(0)} Leaderboard
        </span>
      </div>

    </div>
  );
}
