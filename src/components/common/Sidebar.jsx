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
    { path: '/', label: 'Dashboard', subLabel: 'Overview & core metrics', icon: LayoutDashboard, shortcut: 'G D' },
    { path: '/leads', label: 'Leads', subLabel: 'Sales pipeline & deals', icon: Users, badge: newLeadsCount, shortcut: 'G L' },
    { path: '/analytics', label: 'Analytics', subLabel: 'Growth & forecast reports', icon: BarChart3, shortcut: 'G A' },
  ];

  return (
    <>
      {/* ================= DESKTOP/TABLET SIDEBAR ================= */}
      {/* Renders on medium screens (tablet) and larger. Tablet width: w-24, Desktop width: w-64 */}
      <aside 
        className="hidden md:flex flex-col border-r border-slate-200/80 dark:border-slate-800/60 bg-white/70 dark:bg-[#13151d]/75 backdrop-blur-md transition-all duration-300 relative z-30 md:w-24 lg:w-64 shrink-0"
      >
        {/* Brand/Logo Segment */}
        <div className="p-6 flex items-center justify-center lg:justify-start gap-3 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0">
            <FolderDot size={20} className="animate-pulse" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent hidden lg:inline-block">
            CRM<span className="text-blue-600">Lite</span>
          </span>
        </div>

        {/* Quick Search Button Trigger */}
        <div className="px-4 mb-4 flex justify-center lg:block shrink-0">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 lg:p-0 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer lg:w-full lg:flex lg:items-center lg:gap-2 lg:px-3 lg:py-2 lg:text-sm lg:text-slate-400 lg:dark:text-slate-500 lg:bg-slate-50 lg:dark:bg-slate-900/50 lg:border lg:border-slate-200 lg:dark:border-slate-800/80 lg:rounded-lg lg:hover:border-slate-300 lg:dark:hover:border-slate-700 lg:transition-all lg:text-left flex items-center justify-center"
            title="Search leads (Ctrl+K)"
          >
            <Search size={16} className="lg:size-3.5 shrink-0" />
            <span className="hidden lg:inline flex-1 text-xs text-slate-400 dark:text-slate-500 ml-1.5">Search...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-600 bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800 rounded shadow-sm shrink-0">
              <Command size={8} /> K
            </kbd>
          </button>
        </div>

        {/* Dynamic Navigation Menu Items list */}
        <nav className="flex-1 space-y-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex flex-col lg:flex-row items-center gap-1 lg:gap-3 p-3 lg:px-4 lg:py-3 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                    isActive 
                      ? 'bg-blue-50/70 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-b-2 lg:border-b-0 lg:border-l-2 border-blue-600'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} className={`shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                    
                    <div className="flex flex-col items-center lg:items-start min-w-0">
                      <span className="text-[10px] lg:text-sm font-semibold tracking-wide lg:tracking-normal truncate w-full text-center lg:text-left">
                        {item.label}
                      </span>
                      <span className="hidden lg:inline text-[10px] text-slate-400 dark:text-slate-550 font-normal mt-0.5 truncate max-w-full leading-tight">
                        {item.subLabel}
                      </span>
                    </div>
                    
                    {item.badge ? (
                      <span className="absolute top-1.5 right-1.5 lg:static lg:top-auto lg:right-auto lg:ml-auto bg-blue-100 dark:bg-blue-900/40 text-blue-750 dark:text-blue-300 text-[8px] lg:text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-blue-200/50 dark:border-blue-800/40 shrink-0">
                        {item.badge}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Sidebar Footer Area (Theme switch & Profile details) */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/60 space-y-2.5 shrink-0">
          {/* Light/Dark Mode Switcher */}
          <button 
            onClick={toggleTheme}
            className="w-full flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <>
                <Sun size={20} className="text-amber-500 shrink-0" />
                <span className="text-[10px] lg:text-xs font-semibold lg:flex-1 lg:text-left text-center">Light</span>
              </>
            ) : (
              <>
                <Moon size={20} className="text-indigo-650 dark:text-indigo-400 shrink-0" />
                <span className="text-[10px] lg:text-xs font-semibold lg:flex-1 lg:text-left text-center">Dark</span>
              </>
            )}
          </button>

          {/* User Profile Context Actions Button */}
          <div className="relative" ref={profileDropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all text-left cursor-pointer"
              aria-label="User settings dropdown"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm ring-2 ring-slate-100 dark:ring-slate-800 select-none shrink-0">
                NY
              </div>
              <div className="hidden lg:flex flex-col flex-1 min-w-0">
                <p className="text-xs font-semibold truncate text-slate-900 dark:text-white leading-tight">Navya</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 leading-none">navya@startup.co</p>
              </div>
            </button>

            {/* Profile Dropdown Context Settings Menu overlay */}
            {isProfileOpen && (
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-0 w-40 lg:w-full bg-white dark:bg-[#13151d] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 space-y-0.5 z-50">
                <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer">
                  <User size={12} /> My Profile
                </button>
                <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer">
                  <Settings size={12} /> Settings
                </button>
                <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer">
                  <HelpCircle size={12} /> Help
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
        
        <div className="flex items-center gap-1">
          {/* Mobile search bar trigger with 44x44px min tap target */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-11 h-11 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg cursor-pointer"
            aria-label="Open search dialog"
          >
            <Search size={18} />
          </button>
          {/* Mobile hamburger menu drawer trigger with 44x44px min tap target */}
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="w-11 h-11 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* ================= MOBILE BOTTOM NAVIGATION BAR ================= */}
      {/* Renders only on mobile ports (md:hidden block) with 48x48px (>=44x44px) tap targets */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-[#13151d]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/80 px-6 flex items-center justify-around z-40">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-12 h-12 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/70 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
              aria-label={item.label}
            >
              {({ isActive }) => (
                <div className="relative">
                  <Icon size={22} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                  {item.badge ? (
                    <span className="absolute -top-1 -right-1.5 bg-blue-600 text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white dark:border-[#13151d]">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
              )}
            </NavLink>
          );
        })}
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
              {/* Drawer Close Button with 44x44px target */}
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav list map */}
            <nav className="flex-1 space-y-2">
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
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-semibold text-sm leading-tight">{item.label}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{item.subLabel}</span>
                    </div>
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
              {/* Mobile theme switch toggler with 44px min tap target */}
              <button 
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-3 py-3 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg cursor-pointer"
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
              <div className="flex items-center gap-3 px-2 py-1">
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
