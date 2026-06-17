import React, { useState, useMemo } from 'react';
import { useLeads } from '../context/LeadContext';
import { useTheme } from '../context/ThemeContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Sparkles, 
  Calendar,
  Layers,
  HelpCircle,
  Inbox
} from 'lucide-react';

export default function Analytics() {
  const { leads } = useLeads();
  const { theme, isDark } = useTheme();
  const [timeRange, setTimeRange] = useState('30'); // '7', '30', 'ytd'

  // Colors based on requested spec
  // Primary #2563EB, Success #22C55E, Warning #F59E0B, Danger #EF4444
  const COLORS = {
    Primary: '#2563EB',
    Success: '#22C55E',
    Warning: '#F59E0B',
    Danger: '#EF4444',
    Indigo: '#6366F1',
    Teal: '#14B8A6',
    Slate: '#64748B'
  };

  const donutColors = [
    COLORS.Primary,
    COLORS.Success,
    COLORS.Warning,
    COLORS.Indigo,
    COLORS.Teal
  ];

  // 1. Data Preparation: Lead Sources
  const sourceData = useMemo(() => {
    const sources = {};
    leads.forEach(l => {
      sources[l.source] = (sources[l.source] || 0) + 1;
    });
    return Object.keys(sources).map(key => ({
      name: key,
      value: sources[key]
    }));
  }, [leads]);

  // 2. Data Preparation: Pipeline Stages Count
  const stageData = useMemo(() => {
    const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
    return stages.map(stage => ({
      stage,
      count: leads.filter(l => l.status === stage).length,
      value: leads.filter(l => l.status === stage).reduce((sum, l) => sum + l.value, 0)
    }));
  }, [leads]);

  // 3. Data Preparation: Timeline cumulative pipeline value growth
  const growthData = useMemo(() => {
    // Sort leads by creation date
    const sorted = [...leads].sort((a, b) => a.createdDate.localeCompare(b.createdDate));
    
    // Group values by date
    const dateValues = {};
    sorted.forEach(l => {
      // Filter out Lost leads from active pipeline valuation
      if (l.status !== 'Lost') {
        dateValues[l.createdDate] = (dateValues[l.createdDate] || 0) + l.value;
      }
    });

    let cumulativeSum = 0;
    return Object.keys(dateValues).map(date => {
      cumulativeSum += dateValues[date];
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        'Pipeline Value': cumulativeSum,
        'Daily Deals Added': dateValues[date]
      };
    });
  }, [leads]);

  // 4. Summarized Metrics Calculations
  const stats = useMemo(() => {
    const totalCount = leads.length;
    
    const totalValue = leads
      .filter(l => l.status !== 'Lost')
      .reduce((sum, l) => sum + l.value, 0);

    const avgDealSize = totalCount > 0 ? Math.round(totalValue / totalCount) : 0;
    
    const wonCount = leads.filter(l => l.status === 'Won').length;
    const lostCount = leads.filter(l => l.status === 'Lost').length;
    const winRate = (wonCount + lostCount) > 0 
      ? Math.round((wonCount / (wonCount + lostCount)) * 100) 
      : 0;

    return {
      totalCount,
      totalValue,
      avgDealSize,
      winRate,
      wonCount
    };
  }, [leads]);

  // Theme chart properties (dynamic colors based on mode)
  const chartTextFill = isDark ? '#94a3b8' : '#64748b';
  const gridLineStroke = isDark ? '#1e293b' : '#f1f5f9';
  const tooltipBg = isDark ? '#13151d' : '#ffffff';
  const tooltipBorder = isDark ? '#1e2230' : '#e2e8f0';

  return (
    <div className="space-y-8 pb-12">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white">Analytics insights</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time charts tracking sales acquisition channels, conversion trends, and team metrics.
          </p>
        </div>

        {/* Date Filter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-0.5 rounded-lg flex items-center text-xs">
          <button 
            onClick={() => setTimeRange('7')}
            className={`px-3 py-1.5 rounded-md cursor-pointer font-semibold ${timeRange === '7' ? 'bg-blue-50/70 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/40 dark:border-blue-900/30' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-350'}`}
          >
            7 Days
          </button>
          <button 
            onClick={() => setTimeRange('30')}
            className={`px-3 py-1.5 rounded-md cursor-pointer font-semibold ${timeRange === '30' ? 'bg-blue-50/70 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/40 dark:border-blue-900/30' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-355'}`}
          >
            30 Days
          </button>
          <button 
            onClick={() => setTimeRange('ytd')}
            className={`px-3 py-1.5 rounded-md cursor-pointer font-semibold ${timeRange === 'ytd' ? 'bg-blue-50/70 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/40 dark:border-blue-900/30' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-355'}`}
          >
            YTD
          </button>
        </div>
      </div>

      {/* ================= DOCK PERFORMANCE ROW ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white dark:bg-[#13151d] border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Average Deal Size</span>
            <p className="text-xl font-display font-bold text-slate-900 dark:text-white">
              ${stats.avgDealSize.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13151d] border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#22C55E]/10 text-[#22C55E] rounded-xl">
            <Percent size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Win Ratio KPI</span>
            <p className="text-xl font-display font-bold text-slate-900 dark:text-white">
              {stats.winRate}%
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13151d] border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#F59E0B]/10 text-[#F59E0B] rounded-xl">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Closed Deals Count</span>
            <p className="text-xl font-display font-bold text-slate-900 dark:text-white">
              {stats.wonCount} won
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13151d] border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Layers size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sales Velocity</span>
            <p className="text-xl font-display font-bold text-slate-900 dark:text-white">
              12.4 Days
            </p>
          </div>
        </div>

      </div>

      {/* ================= MAIN DATA VISUALS ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Growth Chart - 2/3 Width */}
        <div className="lg:col-span-2 bg-white dark:bg-[#13151d] border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Pipeline valuation timeline growth</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Cumulative pipeline dollars added over lead creation date history</p>
          </div>

          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPipeline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.Primary} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={COLORS.Primary} stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridLineStroke} />
                <XAxis dataKey="date" tickLine={false} tick={{ fill: chartTextFill, fontSize: 10 }} />
                <YAxis tickLine={false} tick={{ fill: chartTextFill, fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px' }} 
                  labelClassName="font-bold text-xs text-slate-900 dark:text-white"
                  itemStyle={{ fontSize: '11px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Pipeline Value" 
                  stroke={COLORS.Primary} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPipeline)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Proportions Donut - 1/3 Width */}
        <div className="bg-white dark:bg-[#13151d] border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Lead channel acquisition</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Proportions of inbound customer registrations by referral tag</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {sourceData.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-10">
                <Inbox className="mx-auto text-slate-300 dark:text-slate-700 mb-2" size={24} />
                No leads source data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px' }}
                    itemStyle={{ fontSize: '11px', color: chartTextFill }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {sourceData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: donutColors[index % donutColors.length] }}></span>
                <span className="text-slate-550 dark:text-slate-400 truncate">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ================= SECONDARY CHARTS ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stage Value and Counts Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#13151d] border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Active leads count by stage</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Volumetric assessment of pipeline size by lifecycle tag</p>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridLineStroke} />
                <XAxis dataKey="stage" tickLine={false} tick={{ fill: chartTextFill, fontSize: 10 }} />
                <YAxis tickLine={false} tick={{ fill: chartTextFill, fontSize: 10 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Bar 
                  dataKey="count" 
                  fill={COLORS.Primary} 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={40}
                  name="Leads Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Acquisition Quality Sheet */}
        <div className="bg-white dark:bg-[#13151d] border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Performance metrics</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Summary efficiency parameters across all active accounts</p>
          </div>

          <div className="space-y-4 text-xs">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Active Opportunities</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {leads.filter(l => l.status !== 'Lost' && l.status !== 'Won').length} accounts
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Top Source Value</span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <TrendingUp size={12} className="text-[#22C55E]" /> Referral
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Contract Win Target</span>
              <span className="font-bold text-slate-900 dark:text-white">$100,000 / Mo</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Total Revenue Closed</span>
              <span className="font-bold text-[#22C55E] font-display">
                ${leads.filter(l => l.status === 'Won').reduce((sum, l) => sum + l.value, 0).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Pipeline Coverage Ratio</span>
              <span className="font-bold text-slate-905 dark:text-slate-200">
                3.2x quota
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
