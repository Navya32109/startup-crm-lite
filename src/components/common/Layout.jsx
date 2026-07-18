// Import React and standard state/lifecycle hooks for event handling and DOM manipulation
import React, { useState, useEffect, useRef } from 'react';
// Import routing hooks for page-level transitions and location verification
import { useNavigate, useLocation } from 'react-router-dom';
// Import context hooks to fetch leads records for global searches
import { useLeads } from '../../context/LeadContext';
// Import the newly created Sidebar component containing navigation controls
import Sidebar from './Sidebar';
// Import lucide-react icons for search overlay visual hints
import { Search, Command } from 'lucide-react';

/**
 * Layout Component
 * Serves as the main container shell for the application pages.
 * Handles:
 * - Embedding the Sidebar navigation.
 * - Global keyboard listeners (e.g. Cmd+K to search, sequential shortcut navigation "g" then "d/l/a").
 * - Global Leads search popup modal overlay.
 * - Dynamic light/dark theme canvas color transitions.
 */
export default function Layout({ children }) {
  // React Router navigate API reference
  const navigate = useNavigate();
  const location = useLocation();
  // Fetch existing leads list from context to enable global searching
  const { leads = [] } = useLeads();
  
  // State to toggle the visible active state of the Search dialog modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // State containing the typed search query input string
  const [searchQuery, setSearchQuery] = useState('');
  
  // React Ref pointing directly to the search text input DOM element for programmatically focusing
  const searchInputRef = useRef(null);

  // Keyboard shortcut listener to handle Cmd+K and Linear-like hotkeys (e.g. g -> d)
  useEffect(() => {
    // Array buffer to hold sequential keystrokes
    let keySequence = [];
    // Timeout reference to clear key sequence after idle duration
    let timeoutId;

    const handleKeyDown = (e) => {
      // CMD/CTRL + K: Toggles lead search overlay modal
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); // Prevent default browser address bar focus behavior
        setIsSearchOpen(prev => !prev); // Toggle search visibility
        return;
      }

      // Escape key: Closes search modal immediately
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        return;
      }

      // Linear-inspired sequential shortcut: "g" then "d/l/a"
      // Check if user is typing in form inputs. If so, ignore shortcuts.
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) || 
                      document.activeElement.isContentEditable;
      if (isInput) return; // Exit early if user is typing

      // Save character in buffer
      const char = e.key.toLowerCase();
      keySequence.push(char);
      
      // Reset sequence after 1 second of inactivity
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        keySequence = [];
      }, 1000);

      // Check if sequence is complete (e.g. 2 keystrokes starting with 'g')
      if (keySequence.length === 2) {
        if (keySequence[0] === 'g') {
          if (keySequence[1] === 'd') {
            navigate('/'); // Navigate to Dashboard
          } else if (keySequence[1] === 'l') {
            navigate('/leads'); // Navigate to Leads Kanban
          } else if (keySequence[1] === 'a') {
            navigate('/analytics'); // Navigate to Analytics dashboard
          }
        }
        keySequence = []; // Reset buffer
      }
    };

    // Attach listener to window
    window.addEventListener('keydown', handleKeyDown);
    // Cleanup events on hook component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  // Focus search input automatically whenever the search modal overlays screen
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      // Delay focus call slightly to allow layout calculations to complete
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      // Reset search field text when modal closes
      setSearchQuery('');
    }
  }, [isSearchOpen]);

  // Filter leads dynamically based on name, company, email or status matching the query input
  const filteredLeads = searchQuery.trim() === '' 
    ? [] 
    : leads.filter(lead => 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.status.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Limit list count to top 5 results for clean view spacing

  // Callback helper triggered when a search query result is clicked
  const handleSearchSelect = (leadId) => {
    setIsSearchOpen(false); // Close modal
    navigate(`/leads?select=${leadId}`); // Navigate to leads page and select specific lead card
  };

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 animate-fade-in">
        {children}
      </div>
    );
  }

  return (
    // Outer app viewport wrapper matching global canvas background and font styles
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      
      {/* Sidebar Navigation component (Desktop + Mobile configurations) */}
      <Sidebar setIsSearchOpen={setIsSearchOpen} />

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      {/* Offsets top and bottom spacing on mobile screens where mobile header and bottom nav are fixed */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 pb-16 md:py-0">
        {/* Centered maximum width sheet structure containing page viewport children */}
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
          {/* Render children views (Dashboard, Leads, Analytics, etc.) dynamically */}
          {children}
        </div>
      </main>

      {/* ================= COMMAND DIALOG SEARCH OVERLAY ================= */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Clickable backdrop overlay to close modal on background clicks */}
          <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)}></div>
          
          {/* Search container popup card */}
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden mx-4 animate-scale-up">
            
            {/* Search Input Bar row */}
            <div className="flex items-center gap-3 px-4 border-b border-gray-150 dark:border-gray-750">
              <Search size={18} className="text-gray-400 dark:text-gray-500" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search leads, status, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-3.5 text-sm outline-none text-gray-950 dark:text-white bg-transparent placeholder-gray-400"
              />
              {/* ESC helper label button */}
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer"
              >
                ESC
              </button>
            </div>

            {/* Results mapping box */}
            <div className="p-2 max-h-80 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                // Initial prompt layout helper
                <div className="py-8 text-center text-xs text-gray-400 dark:text-gray-550">
                  <Command size={24} className="mx-auto mb-2 text-gray-350 dark:text-gray-650 opacity-60" />
                  <p>Type to search leads...</p>
                  <p className="mt-1 text-[10px] text-gray-450 dark:text-gray-500">Tip: search "Referral", "Won", or "Stark"</p>
                </div>
              ) : filteredLeads.length === 0 ? (
                // Empty search results layout helper
                <div className="py-8 text-center text-xs text-gray-400 dark:text-gray-550">
                  No matching leads found for "{searchQuery}"
                </div>
              ) : (
                // List search results matching leads queries
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-450 dark:text-gray-500 px-3 uppercase tracking-wider mb-2">Leads Matches</p>
                  {filteredLeads.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => handleSearchSelect(lead.id)}
                      className="w-full flex items-center justify-between text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-900/40 rounded-lg cursor-pointer transition-all"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-950 dark:text-white">{lead.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{lead.company} • {lead.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-950 dark:text-gray-300 font-mono">
                          ${lead.value.toLocaleString()}
                        </span>
                        {/* Dynamic status badges colored based on deal states */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          lead.status === 'Won' ? 'bg-green-500/10 text-[#22C55E] dark:text-[#4ADE80] border-green-500/20' :
                          lead.status === 'Lost' ? 'bg-rose-500/10 text-[#EF4444] dark:text-[#F87171] border-rose-500/20' :
                          lead.status === 'Negotiation' ? 'bg-orange-500/10 text-[#FF8F5A] dark:text-[#FFA26E] border-orange-500/20' :
                          'bg-blue-600/10 text-[#3B5CCC] dark:text-[#6C8DFF] border-blue-600/20'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Keyboard Shortcuts Helper Info footer */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-55/50 dark:bg-gray-900/30 border-t border-gray-150 dark:border-gray-750 text-[10px] text-gray-450 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span>Select lead to open drawer detail</span>
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <span>Navigate pages: </span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">G</kbd> then <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">D/L/A</kbd>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
