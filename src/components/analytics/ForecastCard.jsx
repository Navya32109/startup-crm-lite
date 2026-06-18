import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles,
  Info,
  ShieldCheck
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
 * ForecastCard Component
 * Predicts revenue for the next month based on historical 6-month averages,
 * outlining a confidence level and historical growth trajectories.
 */
export default function ForecastCard({ data = {} }) {
  const {
    predictedRevenue = 0,
    confidenceScore = 80,
    growthTrend = 0
  } = data;

  const renderTrendIndicator = () => {
    if (growthTrend > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] bg-emerald-500/10 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-500/10">
          <TrendingUp size={11} />
          +{growthTrend}% Upward Trend
        </span>
      );
    }
    if (growthTrend < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-extrabold text-[10px] bg-rose-500/10 dark:bg-rose-950/20 px-2 py-0.5 rounded-full border border-rose-500/10">
          <TrendingDown size={11} />
          {growthTrend}% Downward Trend
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-extrabold text-[10px] bg-slate-500/10 dark:bg-slate-900/40 px-2 py-0.5 rounded-full border border-slate-500/10">
        <Minus size={11} />
        Flat Trend
      </span>
    );
  };

  // Determine confidence status label and color
  const getConfidenceLevel = (score) => {
    if (score >= 85) return { label: 'High Reliability', color: 'bg-emerald-500 text-emerald-600 dark:text-emerald-400' };
    if (score >= 70) return { label: 'Moderate Reliability', color: 'bg-blue-500 text-blue-600 dark:text-blue-400' };
    return { label: 'Low Reliability', color: 'bg-amber-500 text-amber-600 dark:text-amber-400' };
  };

  const confidence = getConfidenceLevel(confidenceScore);

  return (
    <div className="bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px] relative overflow-hidden group">
      
      {/* Sparkles Background Icon Glow */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 text-blue-500/5 rotate-12 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-45 pointer-events-none">
        <Sparkles size={128} />
      </div>

      {/* Card Header */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
              Revenue Growth Forecast
            </h3>
            <p className="text-[10px] text-slate-450 dark:text-slate-500">
              Predictive revenue modeling built on historical won accounts trajectory.
            </p>
          </div>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 shrink-0">
            <Sparkles size={16} />
          </div>
        </div>

        {/* Forecast Value Indicator */}
        <div className="mt-5 space-y-1">
          <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Predicted Revenue Next Month
          </span>
          <p className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            {formatINR(predictedRevenue)}
          </p>
        </div>

        <div className="mt-3">
          {renderTrendIndicator()}
        </div>
      </div>

      {/* Confidence Score Gauge */}
      <div className="space-y-2 my-auto select-none pt-4 pb-2">
        <div className="flex justify-between items-center text-[10px] font-bold">
          <span className="text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck size={13} className="text-blue-500" />
            Forecast Confidence
          </span>
          <span className={`${confidence.color.split(' ')[1]} font-black`}>
            {confidenceScore}% ({confidence.label})
          </span>
        </div>
        
        {/* Horizontal gauge bar */}
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              confidenceScore >= 85 ? 'bg-emerald-500' : confidenceScore >= 70 ? 'bg-blue-600' : 'bg-amber-550'
            }`}
            style={{ width: `${confidenceScore}%` }}
          ></div>
        </div>
      </div>

      {/* Forecast Explainer Footer */}
      <div className="flex items-center gap-1.5 text-[9px] text-slate-450 dark:text-slate-500 font-semibold select-none pt-2 border-t border-slate-100 dark:border-slate-850/60">
        <Info size={11} className="shrink-0 text-slate-350 dark:text-slate-650" />
        <span>Calculated as the trailing 6-month average of Won revenue deals.</span>
      </div>

    </div>
  );
}
