import { useState, useMemo, useEffect } from 'react';
import { useLeads } from '../context/LeadContext';
import {
  parseLeadDate,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData
} from '../utils/analyticsHelpers';

/**
 * Helper to compute date bounds for current and previous comparisons.
 */
const getPeriodBounds = (timeRange, customStart, customEnd) => {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  
  let currentStart = new Date();
  let prevStart = new Date();
  let prevEnd = new Date();
  
  switch (timeRange) {
    case '7': {
      currentStart.setDate(endOfToday.getDate() - 6);
      currentStart.setHours(0, 0, 0, 0);
      
      prevEnd = new Date(currentStart);
      prevEnd.setDate(prevEnd.getDate() - 1);
      prevEnd.setHours(23, 59, 59, 999);
      
      prevStart = new Date(prevEnd);
      prevStart.setDate(prevStart.getDate() - 6);
      prevStart.setHours(0, 0, 0, 0);
      break;
    }
    case '30': {
      currentStart.setDate(endOfToday.getDate() - 29);
      currentStart.setHours(0, 0, 0, 0);
      
      prevEnd = new Date(currentStart);
      prevEnd.setDate(prevEnd.getDate() - 1);
      prevEnd.setHours(23, 59, 59, 999);
      
      prevStart = new Date(prevEnd);
      prevStart.setDate(prevStart.getDate() - 29);
      prevStart.setHours(0, 0, 0, 0);
      break;
    }
    case '90': {
      currentStart.setDate(endOfToday.getDate() - 89);
      currentStart.setHours(0, 0, 0, 0);
      
      prevEnd = new Date(currentStart);
      prevEnd.setDate(prevEnd.getDate() - 1);
      prevEnd.setHours(23, 59, 59, 999);
      
      prevStart = new Date(prevEnd);
      prevStart.setDate(prevStart.getDate() - 89);
      prevStart.setHours(0, 0, 0, 0);
      break;
    }
    case 'year': {
      currentStart = new Date(endOfToday.getFullYear(), 0, 1, 0, 0, 0, 0);
      
      prevEnd = new Date(endOfToday.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
      prevStart = new Date(endOfToday.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
      break;
    }
    case 'custom': {
      if (customStart) {
        currentStart = new Date(customStart);
        currentStart.setHours(0, 0, 0, 0);
      } else {
        currentStart.setDate(endOfToday.getDate() - 29);
        currentStart.setHours(0, 0, 0, 0);
      }
      
      let tempEnd = new Date();
      if (customEnd) {
        tempEnd = new Date(customEnd);
      }
      tempEnd.setHours(23, 59, 59, 999);
      
      const diffTime = tempEnd.getTime() - currentStart.getTime();
      const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
      
      prevEnd = new Date(currentStart.getTime() - 1);
      prevStart = new Date(prevEnd.getTime() - (diffDays * 24 * 60 * 60 * 1000));
      prevStart.setHours(0, 0, 0, 0);
      break;
    }
    default: {
      currentStart.setDate(endOfToday.getDate() - 29);
      currentStart.setHours(0, 0, 0, 0);
      
      prevEnd = new Date(currentStart);
      prevEnd.setDate(prevEnd.getDate() - 1);
      prevEnd.setHours(23, 59, 59, 999);
      
      prevStart = new Date(prevEnd);
      prevStart.setDate(prevStart.getDate() - 29);
      prevStart.setHours(0, 0, 0, 0);
      break;
    }
  }

  const currentEnd = timeRange === 'custom' && customEnd ? new Date(customEnd) : endOfToday;
  currentEnd.setHours(23, 59, 59, 999);

  return {
    currentStart,
    currentEnd,
    prevStart,
    prevEnd
  };
};

/**
 * Custom hook useAnalytics.
 * Connects to Leads Context and performs time-filtered analytics grouping and comparison metrics.
 */
export const useAnalytics = () => {
  const { leads = [] } = useLeads();
  const [timeRange, setTimeRange] = useState('30');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Trigger loading skeleton on filter change for real SaaS feedback
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [timeRange, customStartDate, customEndDate]);

  // Determine date bounds
  const bounds = useMemo(() => {
    return getPeriodBounds(timeRange, customStartDate, customEndDate);
  }, [timeRange, customStartDate, customEndDate]);

  // Segment leads into current, previous, and overall pools
  const leadSegmentation = useMemo(() => {
    const currentList = [];
    const previousList = [];

    leads.forEach(lead => {
      const lDate = parseLeadDate(lead.createdAt || lead.createdDate);
      if (!lDate) return;

      if (lDate >= bounds.currentStart && lDate <= bounds.currentEnd) {
        currentList.push(lead);
      } else if (lDate >= bounds.prevStart && lDate <= bounds.prevEnd) {
        previousList.push(lead);
      }
    });

    return {
      currentList,
      previousList
    };
  }, [leads, bounds]);

  const filteredLeads = leadSegmentation.currentList;
  const previousLeads = leadSegmentation.previousList;

  // Calculate full suite of stats for the current filtered period
  const stats = useMemo(() => {
    const totalLeads = filteredLeads.length;
    const pipelineValue = getPipelineValue(filteredLeads);
    const wonRevenue = getWonRevenue(filteredLeads);
    const avgSalesCycle = getAverageSalesCycle(filteredLeads);
    const lostRate = getLostRate(filteredLeads);
    
    const wonCount = filteredLeads.filter(l => l.status === 'Won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonCount / totalLeads) * 100) : 0;

    return {
      totalLeads,
      pipelineValue,
      wonRevenue,
      avgSalesCycle,
      lostRate,
      conversionRate
    };
  }, [filteredLeads]);

  // Calculate stats for the previous period to facilitate growth comparison percentages
  const prevStats = useMemo(() => {
    const totalLeads = previousLeads.length;
    const pipelineValue = getPipelineValue(previousLeads);
    const wonRevenue = getWonRevenue(previousLeads);
    const avgSalesCycle = getAverageSalesCycle(previousLeads);
    const lostRate = getLostRate(previousLeads);

    const wonCount = previousLeads.filter(l => l.status === 'Won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonCount / totalLeads) * 100) : 0;

    return {
      totalLeads,
      pipelineValue,
      wonRevenue,
      avgSalesCycle,
      lostRate,
      conversionRate
    };
  }, [previousLeads]);

  // Generate Recharts-compatible data bundles
  const chartData = useMemo(() => {
    // Note: Certain charts (like Month-over-Month historical trends or activity heatmap)
    // require viewing the whole dataset rather than restricting to the filtered date range,
    // so they are calculated relative to leads (full history).
    return {
      statusDistribution: getStatusDistribution(filteredLeads),
      monthlyLeadsTrend: getMonthlyLeads(leads),
      monthlyConversionTrend: getConversionByMonth(leads),
      revenueAnalytics: getRevenueByMonth(leads),
      leadSourceStats: getLeadSourceStats(filteredLeads),
      funnelData: getFunnelData(filteredLeads),
      salesVelocity: getSalesVelocity(filteredLeads),
      prevSalesVelocity: getSalesVelocity(previousLeads),
      forecast: getForecastRevenue(leads), // Forecast based on 6-month full database trends
      heatmapData: getActivityHeatmapData(leads), // Heatmap tracks absolute contribution logs
      topPerformers: getTopPerformers(filteredLeads)
    };
  }, [leads, filteredLeads, previousLeads]);

  return {
    timeRange,
    setTimeRange,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    filteredLeads,
    stats,
    prevStats,
    chartData,
    hasLeads: leads.length > 0,
    isLoading
  };
};
