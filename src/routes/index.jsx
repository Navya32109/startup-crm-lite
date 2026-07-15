// Import React, lazy loading API, and Suspense component for route-level split loading
import React, { lazy, Suspense } from 'react';
// Import routing configuration utilities from react-router-dom
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// Import user authentication context hook
import { useAuth } from '../context/AuthContext';

// ----------------- LAZY PAGE IMPORTS -----------------
const Dashboard = lazy(() => import('../pages/Dashboard')); // Dashboard page chunk
const Leads = lazy(() => import('../pages/Leads')); // Lead Management page chunk
const Analytics = lazy(() => import('../pages/Analytics')); // Analytics & Chart page chunk
const NotFound = lazy(() => import('../pages/NotFound')); // Custom 404 Error page chunk
const Login = lazy(() => import('../pages/Login')); // Login page chunk
const Register = lazy(() => import('../pages/Register')); // Register page chunk
const Profile = lazy(() => import('../pages/Profile')); // User Profile page chunk
const Settings = lazy(() => import('../pages/Settings')); // Workspace Settings page chunk

// ----------------- PERFORMANCE FALLBACK LOADER -----------------
// Standard premium loader wrapper displayed while the browser pulls a chunk file in the background.
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-4">
    {/* Animated spinning loader ring with accent colors */}
    <div className="relative flex items-center justify-center">
      <div className="h-12 w-12 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-500 animate-spin"></div>
      <div className="absolute h-4 w-4 rounded-full bg-blue-600/30 dark:bg-blue-500/20 animate-ping"></div>
    </div>
    <span className="text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-550 uppercase select-none">
      Loading CRM Module...
    </span>
  </div>
);

// ----------------- PROTECTED ROUTE ADAPTER -----------------
/**
 * ProtectedRoute Component
 * Intercepts routing navigation. If the user session has not finished restoring,
 * it yields page loader spinners. If no valid authentication token exists, it redirects to /login.
 */
const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

/**
 * AppRoutes Component
 * Sets up routing structure, wrapping protected dashboards, pipelines,
 * and analytics metrics charts within authentication intercepts.
 */
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Guest Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Wildcard catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
