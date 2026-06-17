// Import core React hooks for layout and UI state control
import React, { useState, useRef, useEffect } from 'react';
// Import NavLink from react-router-dom to handle navigation links with built-in active state logic
import { NavLink } from 'react-router-dom';
// Import custom theme state hook to toggle and consume theme styling (dark/light)
import { useTheme } from '../../context/ThemeContext';
// Import custom lead context hook to display dynamic badge counts for 'New' leads
import { useLeads } from '../../context/LeadContext';
// Import specialized UI icons from lucide-react library
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ChevronLeft, 
  ChevronRight, 
  Command, 
  LogOut, 
  User, 
  Settings, 
  HelpCircle,
  FolderDot
} from 'lucide-react';

/**
 * Sidebar Navigation Component
 * Combines a collapsible desktop sidebar, a mobile top header, and a drawer menu overlay.
 * Uses NavLink to highlight the currently active route.
 * 
 * Props:
 * - setIsSearchOpen (function): callback to trigger the application-wide Search Dialog overlay.
 */
export default function Sidebar({ setIsSearchOpen }) {
  // Pull theme utilities from ThemeContext
  const { toggleTheme, isDark } = useTheme();
  // Pull lead records from LeadContext
  const { leads } = useLeads();
  
  // State to manage whether the desktop sidebar is minimized (w-16) or expanded (w-64)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // State to control mobile drawer overlay visibility on smaller viewports
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // State to toggle the user profile settings popup dropdown
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Reference container hook to capture the profile dropdown element for detecting outside clicks
  const profileDropdownRef = useRef(null);

  // Calculate the total number of unread/new leads in real-time to render on the Leads link badge
  const newLeadsCount = leads.filter(l => l.status === 'New').length;

  // Handle clicking outside the profile context menu to close it automatically
  useEffect(() => {
    const handleClickOutside = (e) => {
      // If the clicked target is outside the dropdown ref container, close the dropdown
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    // Attach listener to mouse down events
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup handler on component unmount to prevent leaks
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Configure navigation item routes, titles, icons, badges, and shortcut text
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, shortcut: 'G D' },
    { path: '/leads', label: 'Leads', icon: Users, badge: newLeadsCount, shortcut: 'G L' },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, shortcut: 'G A' },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      {/* Renders only on medium screens and larger (md:flex) */}
      <aside 
        className={`hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800/60 bg-white/70 dark:bg-[#13151d]/75 backdrop-blur-md transition-all duration-300 relative z-30 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Sidebar Collapse Toggle Icon Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-8 bg-white dark:bg-[#13151d] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-full p-1 hover:text-primary dark:hover:text-primary-light hover:shadow-sm cursor-pointer"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Brand/Logo Segment */}
        <div className={`p-6 flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0">
            {/* Pulsing visual mark */}
            <FolderDot size={20} className="animate-pulse" />
          </div>
          {/* Hide title when sidebar is collapsed */}
          {!isSidebarCollapsed && (
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              CRM<span className="text-blue-600">Lite</span>
            </span>
          )}
        </div>

        {/* Desktop Quick Search Button Trigger */}
        <div className={`px-4 mb-4 ${isSidebarCollapsed ? 'flex justify-center px-0' : ''}`}>
          {isSidebarCollapsed ? (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer"
              title="Search leads (Ctrl+K)"
            >
              <Search size={18} />
            </button>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left cursor-pointer"
            >
              <Search size={14} />
              <span className="flex-1 text-xs">Search...</span>
              {/* Keyboard indicator command visual helper */}
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-600 bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800 rounded shadow-sm">
                <Command size={8} /> K
              </kbd>
            </button>
          )}
        </div>

        {/* Dynamic Navigation Menu Items list */}
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                // NavLink active checker automatically resolves relative paths to inject conditional highlighted layouts
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative cursor-pointer ${
                    isActive 
                      ? 'bg-blue-50/70 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-l-2 border-blue-600'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                {/* Dynamic styling for navigation icons based on NavLink active state */}
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={`shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                    
                    {/* Render detailed navigation labels if sidebar is expanded */}
                    {!isSidebarCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {/* Render active count badge if present, otherwise render quick shortcut */}
                        {item.badge ? (
                          <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-blue-200/50 dark:border-blue-800/40">
                            {item.badge}
                          </span>
                        ) : (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-slate-400 dark:text-slate-600">
                            {item.shortcut}
                          </span>
                        )}
                      </>
                    )}
                    
                    {/* Collapsed Sidebar Hover Tooltips */}
                    {isSidebarCollapsed && (
                      <div className="absolute left-14 hidden group-hover:block bg-slate-900 text-white text-xs py-1 px-2.5 rounded shadow-lg whitespace-nowrap z-50">
                        {item.label} {item.badge ? `(${item.badge})` : `[${item.shortcut}]`}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Sidebar Footer Area (Theme switch & Profile details) */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/60 space-y-2.5">
          
          {/* Light/Dark Mode Switcher */}
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-lg cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            {isDark ? (
              <>
                <Sun size={18} className="text-amber-500 shrink-0" />
                {!isSidebarCollapsed && <span className="flex-1">Light Mode</span>}
              </>
            ) : (
              <>
                <Moon size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                {!isSidebarCollapsed && <span className="flex-1">Dark Mode</span>}
              </>
            )}
          </button>

          {/* User Profile Context Actions Button */}
          <div className="relative" ref={profileDropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all text-left cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-0' : ''
              }`}
            >
              {/* Profile Avatar icon representation */}
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm ring-2 ring-slate-100 dark:ring-slate-800 select-none shrink-0">
                NY
              </div>
              {/* Hide user labels when sidebar is collapsed */}
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate text-slate-900 dark:text-white">Navya</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">navya@startup.co</p>
                </div>
              )}
            </button>

            {/* Profile Dropdown Context Settings Menu overlay */}
            {isProfileOpen && !isSidebarCollapsed && (
              <div className="absolute bottom-12 left-0 w-full bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 space-y-0.5 z-50">
                <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer">
                  <User size={12} /> My Profile
                </button>
                <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer">
                  <Settings size={12} /> Settings
                </button>
                <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer">
                  <HelpCircle size={12} /> Help Center
                </button>
                <div className="border-t border-slate-100 dark:border-slate-800/80 my-1"></div>
                <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer">
                  <LogOut size={12} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ================= MOBILE NAVIGATION HEADER ================= */}
      {/* Renders only on mobile ports (md:hidden block) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#13151d]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/60 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
            <FolderDot size={18} />
          </div>
          <span className="font-display font-bold text-base bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            CRM<span className="text-blue-600">Lite</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mobile search bar trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg cursor-pointer"
            aria-label="Open search dialog"
          >
            <Search size={18} />
          </button>
          {/* Mobile hamburger menu drawer trigger */}
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* ================= MOBILE DRAWER NAVIGATION OVERLAY ================= */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Semi-transparent backdrop shadow element */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}></div>
          
          {/* Sliding drawer navigation layout panel */}
          <aside className="relative flex flex-col w-72 max-w-[80vw] bg-white dark:bg-[#13151d] h-full shadow-2xl p-5 border-r border-slate-200 dark:border-slate-800 animate-slide-in">
            {/* Logo and close buttons header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white">
                  <FolderDot size={18} />
                </div>
                <span className="font-display font-bold text-base">CRM<span className="text-blue-600">Lite</span></span>
              </div>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav list map */}
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-blue-50/70 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Mobile Sidebar Footer (Theme toggle & profile details) */}
            <div className="pt-5 border-t border-slate-150 dark:border-slate-800 space-y-4">
              {/* Mobile theme switch toggler */}
              <button 
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg cursor-pointer"
              >
                {isDark ? (
                  <>
                    <Sun size={18} className="text-amber-500" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={18} className="text-indigo-500" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {/* User details item */}
              <div className="flex items-center gap-3 px-2">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                  NY
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate text-slate-900 dark:text-white">Navya</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-550 truncate">navya@startup.co</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
