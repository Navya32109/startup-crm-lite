import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import ForecastCard from '../components/analytics/ForecastCard';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';
import { BarChart3 } from 'lucide-react';

/**
 * Analytics Dashboard Component
 * Orchestrates the full Advanced Analytics suite, rendering:
 * - Page Header & Filter controls
 * - 6 KPI stats cards
 * - Doughnut & Funnel performance visualizations
 * - Monthly trends charts (Leads Intake & Conversion Trends)
 * - Revenue area growth & Marketing lead sources
 * - Heatmaps, Forecast widgets, Sales velocity, & Top performers
 */
export default function Analytics() {
  const {
    timeRange,
    setTimeRange,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    stats,
    prevStats,
    chartData,
    hasLeads,
    isLoading
  } = useAnalytics();

  return (
    <div className="space-y-6 pb-12 relative text-xs">
      
      {/* ================= PAGE HEADER ROW ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="text-blue-600 dark:text-blue-500 shrink-0" size={28} />
            Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track sales performance, growth trends, team velocity, and revenue forecasting metrics.
          </p>
        </div>
      </div>

      {/* If there are absolutely no leads in the CRM database, display the onboarding empty state */}
      {!hasLeads ? (
        <EmptyAnalyticsState />
      ) : (
        <>
          {/* ================= DATE RANGE FILTERS ================= */}
          <AnalyticsFilters 
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
          />

          {/* ================= SKELETON OR DASHBOARD CONTENT ================= */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-6 animate-fade-in">
              
              {/* Row 1: KPI Cards */}
              <StatsCards 
                stats={stats} 
                prevStats={prevStats} 
              />

              {/* Row 2: Pie Chart & Funnel Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PieChartCard 
                  data={chartData.statusDistribution} 
                  totalLeads={stats.totalLeads} 
                />
                <FunnelChartCard 
                  data={chartData.funnelData} 
                />
              </div>

              {/* Row 3: Bar Chart & Line Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BarChartCard 
                  data={chartData.monthlyLeadsTrend} 
                />
                <LineChartCard 
                  data={chartData.monthlyConversionTrend} 
                />
              </div>

              {/* Row 4: Revenue Chart & Lead Sources Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RevenueChartCard 
                  data={chartData.revenueAnalytics} 
                />
                <LeadSourceChart 
                  data={chartData.leadSourceStats} 
                />
              </div>

              {/* Row 5: Heatmap & Top Performers Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActivityHeatmap 
                  data={chartData.heatmapData} 
                />
                <TopPerformersCard 
                  data={chartData.topPerformers} 
                />
              </div>

              {/* Row 6: Forecast Card & Sales Velocity Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ForecastCard 
                  data={chartData.forecast} 
                />
                <SalesVelocityCard 
                  data={chartData.salesVelocity} 
                  prevData={chartData.prevSalesVelocity}
                />
              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
}
