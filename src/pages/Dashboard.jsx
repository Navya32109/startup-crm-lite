import React from 'react';
// Import routing hooks for navigate redirections
import { useNavigate } from 'react-router-dom';
// Import global leads state hook to connect dashboard directly to database context
import { useLeads } from '../context/LeadContext';
// Import modular dashboard child components
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
// Import toast notification trigger for visual actions feedback
import { toast } from 'react-hot-toast';
// Import lucide-react icons for dashboard metric representations
import { 
  Users, 
  DollarSign, 
  Target, 
  Activity, 
  TrendingUp 
} from 'lucide-react';

/**
 * Dashboard Page Component
 * Serves as the operational control panel for the CRM.
 * Integrates KPI metrics cards, horizontal pipeline visualizations, recent
 * prospect tables, and action workflows inside a mobile-responsive grid.
 * 
 * @returns {React.JSX.Element} The rendered Dashboard page element.
 */
export default function Dashboard() {
  // Pull leads database lists from LeadContext
  const { leads = [] } = useLeads();
  // Fetch router navigation helper API
  const navigate = useNavigate();

  // ----------------- CALCULATE CRM KPI METRICS -----------------
  // Metric 1: Total leads count
  const totalLeads = leads.length;

  // Metric 2: Cumulative active pipeline valuation (excluding Lost deals)
  const pipelineValue = leads
    .filter(l => l.status !== 'Lost')
    .reduce((sum, l) => sum + l.value, 0);

  // Metric 3: Win Rate percentage calculation (Won count vs closed deals count)
  const wonCount = leads.filter(l => l.status === 'Won').length;
  const lostCount = leads.filter(l => l.status === 'Lost').length;
  const closedCount = wonCount + lostCount;
  const winRate = closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : 0;

  // Metric 4: Active ongoing negotiation deals count
  const activeDeals = leads.filter(l => ['Proposal', 'Negotiation'].includes(l.status)).length;

  // ----------------- ACTIONS HANDLERS -----------------
  /**
   * Action: Navigates back to the Leads view and triggers the add lead modal state.
   */
  const handleAddNewLeadClick = () => {
    toast.success('Navigating to Leads pipeline...', { id: 'nav-leads' });
    navigate('/leads');
  };

  /**
   * Action: Navigates straight to the Leads page list/kanban board view.
   */
  const handleViewAllClick = () => {
    navigate('/leads');
  };

  /**
   * Action: Generates a CSV export of active lead entries and triggers a download.
   */
  const handleExportClick = () => {
    if (leads.length === 0) {
      toast.error('No lead records available to export.');
      return;
    }

    try {
      // Define CSV headers list
      const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Stage Status', 'Deal Value ($)', 'Source', 'Priority', 'Owner', 'Created Date'];
      
      // Map leads into tabular string records
      const rows = leads.map(l => [
        l.id,
        `"${l.name.replace(/"/g, '""')}"`,
        `"${l.company.replace(/"/g, '""')}"`,
        l.email,
        l.phone || '',
        l.status,
        l.value,
        l.source,
        l.priority,
        l.owner,
        l.createdDate
      ]);

      // Join headers and records with carriage returns
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      
      // Build download blob payload
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create trigger link element to download blob silently
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `crm_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Execute click download
      link.click();
      // Remove temporary link element from DOM
      document.body.removeChild(link);
      
      toast.success('CSV Export downloaded successfully!');
    } catch (err) {
      toast.error('Failed to generate CSV export.');
      console.error(err);
    }
  };

  /**
   * Helper action: clicking a lead row redirect selects and reveals its details drawer.
   * 
   * @param {string} leadId - The unique ID of the target lead.
   */
  const handleSelectLeadRow = (leadId) => {
    navigate(`/leads?select=${leadId}`);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* ================= HEADER AREA ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Welcome back, Navya
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Operational dashboard compiling deal flow, pipeline values, and marketing conversion rates.
          </p>
        </div>
        
        {/* System Online Badge */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-bold tracking-wide text-slate-600 dark:text-slate-400 bg-white dark:bg-[#13151d] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            Live Synchronized
          </span>
        </div>
      </div>

      {/* ================= STATS CARD GRID ================= */}
      {/* Requirements: 1 column on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total leads count */}
        <StatsCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          change="+14.8%"
          color="primary"
        />

        {/* Card 2: Active Pipeline valuation */}
        <StatsCard
          title="Pipeline Value"
          value={`$${pipelineValue.toLocaleString()}`}
          icon={DollarSign}
          change="+24.2%"
          color="success"
        />

        {/* Card 3: Win Rate conversion */}
        <StatsCard
          title="Conversion Win Rate"
          value={`${winRate}%`}
          icon={Target}
          change="+5.1%"
          color="warning"
        />

        {/* Card 4: Active deals in late negotiation stage */}
        <StatsCard
          title="Late-Stage Deals"
          value={activeDeals}
          icon={Activity}
          change="-2.4%"
          color="danger"
        />

      </div>

      {/* ================= PIPELINE VISUALIZATION ================= */}
      <PipelineOverview leads={leads} />

      {/* ================= DATA GRID ROW ================= */}
      {/* Two columns layout on large screens, single column on tablets/mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) - Recent Leads Table */}
        <div className="lg:col-span-2">
          <RecentLeads 
            leads={leads} 
            onSelectLead={handleSelectLeadRow}
          />
        </div>

        {/* Right Column (1/3 width) - Quick Database Workflows */}
        <div>
          <QuickActions
            onAddLeadClick={handleAddNewLeadClick}
            onViewAllClick={handleViewAllClick}
            onExportClick={handleExportClick}
          />
        </div>

      </div>

    </div>
  );
}
