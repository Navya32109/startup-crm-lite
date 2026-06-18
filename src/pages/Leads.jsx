import { useState } from 'react';
// Import global leads state hook to connect Leads page straight to CRM context
import { useLeads } from '../context/LeadContext';
// Import child modular layout components
import LeadForm from '../components/leads/LeadForm';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';
// Import React Hot Toast triggers for user notifications
import { toast } from 'react-hot-toast';
// Import specialized UI icons
import { 
  Plus, 
  Grid, 
  List, 
  X
} from 'lucide-react';
// Import new search and filter components
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';

/**
 * Leads Page Component
 * Renders the leads dashboard, implementing responsive layout toggles (Card/Grid vs List Table),
 * advanced keyword filtering, database exports, and a popup modal containing the edit/create form.
 * 
 * @returns {React.JSX.Element} The rendered Leads page dashboard.
 */
export default function Leads() {
  // Extract leads context database array and CRUD modification action dispatchers
  const { leads = [], addLead, updateLead, deleteLead } = useLeads();

  // Local state elements
  const [viewType, setViewType] = useState('board'); // 'board' represents Card/Grid view, 'list' represents Table view
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // holds lead object when editing, otherwise null for creation
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');


  /**
   * Action: Opens the modal sheet formatted for new lead creation.
   */
  const handleAddLeadClick = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  /**
   * Action: Opens the modal populated with details of the chosen lead for updates.
   * 
   * @param {Object} lead - The lead item data selected for editing.
   */
  const handleEditLeadClick = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  /**
   * Action: Dispatches delete execution after user confirmation, displaying error toast.
   * 
   * @param {string} leadId - The unique ID of the target lead.
   */
  const handleDeleteLeadClick = (leadId) => {
    const targetLead = leads.find(l => l.id === leadId);
    const name = targetLead ? targetLead.name : 'Prospect';

    if (window.confirm(`Are you sure you want to permanently delete ${name}?`)) {
      deleteLead(leadId);
      // Red toast notification for deletions as requested
      toast.error(`${name} has been removed.`, {
        icon: '🗑️',
        className: 'dark:bg-slate-900 dark:text-white dark:border dark:border-slate-800'
      });
    }
  };

  /**
   * Action: Receives submitted data from the form, resolving between create or update database commands.
   * 
   * @param {Object} formData - The lead values object parsed from the form component.
   */
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // Update existing lead details
      updateLead(selectedLead.id, formData);
      toast.success(`${formData.name} updated successfully!`, {
        icon: '✅',
        className: 'dark:bg-slate-900 dark:text-white dark:border dark:border-slate-800'
      });
    } else {
      // Create new lead record
      addLead(formData);
      toast.success(`New lead ${formData.name} created!`, {
        icon: '🎉',
        className: 'dark:bg-slate-900 dark:text-white dark:border dark:border-slate-800'
      });
    }
    // Close modal form sheet
    setIsModalOpen(false);
  };

  // Filter leads dynamically based on search query and active filter
  const filteredLeads = leads
    .filter(lead => {
      if (activeFilter === 'All') return true;

      const filterMap = {
        'Meeting Scheduled': ['Meeting Scheduled', 'Qualified'],
        'Proposal Sent': ['Proposal Sent', 'Proposal', 'Negotiation']
      };

      if (filterMap[activeFilter]) {
        return lead.status && filterMap[activeFilter].includes(lead.status);
      }

      return lead.status === activeFilter;
    })
    .filter(lead => 
      (lead.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (lead.company || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (lead.email || '').toLowerCase().includes(searchQuery.toLowerCase()) 
    );

  return (
    <div className="space-y-6 pb-12 relative text-xs">
      
      {/* ================= PAGE HEADER ROW ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Leads pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your sales funnel, update prospect contact details, and evaluate acquisition channels.
          </p>
        </div>

        {/* View togglers and action buttons */}
        <div className="flex items-center gap-3">
          {/* Layout view switcher (hidden on mobile and desktop, visible only on tablet) */}
          <div className="hidden md:flex lg:hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 rounded-lg items-center shadow-inner">
            <button 
              onClick={() => setViewType('board')}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${
                viewType === 'board' 
                  ? 'bg-white dark:bg-[#13151d] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/20 dark:border-slate-800/40' 
                  : 'text-slate-400 hover:text-slate-650 dark:hover:text-slate-200'
              }`}
              title="Grid Cards View"
            >
              <Grid size={15} />
            </button>
            <button 
              onClick={() => setViewType('list')}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${
                viewType === 'list' 
                  ? 'bg-white dark:bg-[#13151d] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/20 dark:border-slate-800/40' 
                  : 'text-slate-400 hover:text-slate-650 dark:hover:text-slate-200'
              }`}
              title="List Table View"
            >
              <List size={15} />
            </button>
          </div>

          {/* Add Lead primary action button */}
          <button
            onClick={handleAddLeadClick}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 active:scale-95 transition-all"
          >
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      {/* ================= SEARCH & FILTER ================= */}
      <div className="bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col gap-4">
        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        {/* Filter Bar */}
        <FilterBar 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
          leads={leads} 
        />
      </div>

      {/* ================= CUSTOM VIEWPORTS SWITCH LIST ================= */}
      <div className="relative">
        {filteredLeads.length === 0 ? (
          // Empty state component
          <EmptyState 
            hasLeads={leads.length > 0}
            onClearFilters={() => {
              setSearchQuery('');
              setActiveFilter('All');
            }}
          />
        ) : (
          <>
            {/* Mobile Viewport (< md): Card view only (table is hidden) */}
            <div className="block md:hidden">
              <div className="grid grid-cols-1 gap-6">
                {filteredLeads.map(lead => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onEditClick={handleEditLeadClick}
                    onDeleteClick={handleDeleteLeadClick}
                  />
                ))}
              </div>
            </div>

            {/* Tablet Viewport (md to lg): Hybrid view toggled by viewType */}
            <div className="hidden md:block lg:hidden">
              {viewType === 'board' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredLeads.map(lead => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onEditClick={handleEditLeadClick}
                      onDeleteClick={handleDeleteLeadClick}
                    />
                  ))}
                </div>
              ) : (
                <LeadTable
                  leads={filteredLeads}
                  onEditClick={handleEditLeadClick}
                  onDeleteClick={handleDeleteLeadClick}
                />
              )}
            </div>

            {/* Desktop Viewport (>= lg): Full table view with all columns visible */}
            <div className="hidden lg:block">
              <LeadTable
                leads={filteredLeads}
                onEditClick={handleEditLeadClick}
                onDeleteClick={handleDeleteLeadClick}
              />
            </div>
          </>
        )}
      </div>

      {/* ================= CREATE / EDIT FORM POPUP MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center md:p-4">
          {/* Modal semi-transparent blur overlay (only shown on md+) */}
          <div 
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity hidden md:block"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal content container card sheet */}
          {/* Mobile: full screen, no rounded corners, fills viewport. Tablet+: centered modal with max-w-lg */}
          <div className="relative bg-white dark:bg-[#13151d] md:border md:border-slate-200 dark:md:border-slate-800 w-full min-h-screen md:min-h-0 md:max-w-lg md:rounded-2xl shadow-2xl overflow-y-auto md:overflow-hidden z-10 animate-scale-up flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/10 shrink-0">
              <h3 className="font-display font-black text-sm text-slate-900 dark:text-white">
                {selectedLead ? `Edit Details: ${selectedLead.name}` : 'Introduce Opportunity Deal'}
              </h3>
              {/* Close Button with >=44x44px tap target size */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
                aria-label="Close form"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Scrollable Form Frame */}
            <div className="p-6 flex-1 overflow-y-auto">
              <LeadForm
                initialData={selectedLead}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
