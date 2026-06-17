// Import React, lazy loading API, and Suspense component for route-level split loading
import React, { lazy, Suspense } from 'react';
// Import routing configuration utilities from react-router-dom
import { Routes, Route } from 'react-router-dom';

// ----------------- LAZY PAGE IMPORTS -----------------
// Lazy load page components. These calls instruct Vite to package these routes into separate JS bundles (chunks)
// which are only downloaded by the browser when the corresponding path is visited by the user.
const Dashboard = lazy(() => import('../pages/Dashboard')); // Dashboard page chunk
const Leads = lazy(() => import('../pages/Leads')); // Lead Management page chunk
const Analytics = lazy(() => import('../pages/Analytics')); // Analytics & Chart page chunk
const NotFound = lazy(() => import('../pages/NotFound')); // Custom 404 Error page chunk

// ----------------- PERFORMANCE FALLBACK LOADER -----------------
// Standard premium loader wrapper displayed while the browser pulls a chunk file in the background.
// Uses smooth Tailwind animations (spin) and matching brand color styling.
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-4">
    {/* Animated spinning loader ring with accent colors */}
    <div className="relative flex items-center justify-center">
      <div className="h-12 w-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-blue-600 dark:border-t-blue-500 animate-spin"></div>
      <div className="absolute h-4 w-4 rounded-full bg-blue-600/30 dark:bg-blue-500/20 animate-ping"></div>
    </div>
    {/* Micro loading label */}
    <span className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase select-none">
      Loading CRM Module...
    </span>
  </div>
);

/**
 * AppRoutes Component
 * Wraps page-level routing in React.Suspense so chunk downloads do not block paint,
 * displaying the loading fallback spinner until the components finish downloading.
 */
export default function AppRoutes() {
  return (
    // Suspense intercepts lazy loading promises and renders the fallback layout during asynchronous state changes
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Route: Dashboard (Home page layout at path: /) */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Route: Lead Management page (Kanban deals layout at path: /leads) */}
        <Route path="/leads" element={<Leads />} />
        
        {/* Route: Analytics & charts page (Visualization tools at path: /analytics) */}
        <Route path="/analytics" element={<Analytics />} />
        
        {/* Wildcard Route: Catches any unspecified URL path and routes to the 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
