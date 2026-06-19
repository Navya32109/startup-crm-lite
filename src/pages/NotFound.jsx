// Import React and necessary layout hooks/components
import React from 'react';
// Import Link component from React Router for fast client-side navigation without full-page reloads
import { Link } from 'react-router-dom';
// Import modern icons from lucide-react to enrich visual layout feedback
import { Home, ArrowLeft, AlertTriangle, Compass } from 'lucide-react';

/**
 * NotFound Page Component
 * Renders a visually premium, responsive 404 page with glassmorphic cards,
 * soft gradients, hover effects, and helpful navigation options.
 */
export default function NotFound() {
  return (
    // Outer layout container centering the content vertically and horizontally with a subtle background gradient
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 text-center">
      
      {/* Decorative floating shapes to give a premium, layered aesthetic to the page background */}
      <div className="relative w-full max-w-lg">
        {/* Glow effect blur circle 1 */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        {/* Glow effect blur circle 2 */}
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        {/* main interactive glassmorphism card */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden transition-all duration-300">
          
          {/* Compass Icon containing micro-animation to indicate searching for a path */}
          <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-8 animate-bounce" style={{ animationDuration: '3s' }}>
            <Compass size={40} className="text-white" />
          </div>

          {/* Large decorative 404 typography with text-shadow and gradient effect */}
          <h1 className="text-8xl font-display font-black tracking-widest bg-gradient-to-r from-blue-600 via-indigo-500 to-indigo-700 dark:from-blue-400 dark:via-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent select-none">
            404
          </h1>

          {/* User-facing error message title */}
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-4">
            Page Not Found
          </h2>

          {/* Explanatory description containing details of the mismatch */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 max-w-sm mx-auto leading-relaxed">
            The link you followed might be broken, or the page may have been removed. Let's get you back on track.
          </p>

          {/* Interactive navigation buttons to direct users back to safety */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Primary Action Button: Link back to Dashboard */}
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl cursor-pointer shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Home size={16} />
              <span>Back to Dashboard</span>
            </Link>

            {/* Secondary Action Button: Back to the previous page */}
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/80 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold px-6 py-3 rounded-xl border border-gray-205 dark:border-gray-700 cursor-pointer active:scale-95 transition-all"
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>
          </div>

          {/* Alert label indicator at the bottom */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700/60 pt-6">
            <AlertTriangle size={12} className="text-amber-500/70" />
            <span>Path: {window.location.pathname}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
