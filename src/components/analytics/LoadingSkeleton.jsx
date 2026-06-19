import React from 'react';

/**
 * LoadingSkeleton Component
 * Renders pulse placeholders for the 6 KPI stats cards and chart panels,
 * replicating the exact layout structure to avoid layout shifts.
 */
export default function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-4 w-72 bg-gray-100 dark:bg-gray-700/60 rounded-md"></div>
        </div>
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>

      {/* 2. KPI Summary Cards Skeleton (6 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl space-y-3 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700/60 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
            <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700/60 rounded-lg"></div>
            <div className="h-3.5 w-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* 3. Visual Panels Grid - Row 1 (Pie & Funnel) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl h-80 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="h-4.5 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-48 bg-gray-100 dark:bg-gray-700/60 rounded"></div>
          </div>
          <div className="mx-auto h-36 w-36 rounded-full border-[16px] border-gray-100 dark:border-gray-700 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700/60"></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/60 rounded"></div>
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/60 rounded"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl h-80 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="h-4.5 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-48 bg-gray-100 dark:bg-gray-700/60 rounded"></div>
          </div>
          <div className="space-y-3 my-auto px-4">
            <div className="h-7 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-7 w-[80%] bg-gray-200 dark:bg-gray-700/80 rounded-lg mx-auto"></div>
            <div className="h-7 w-[60%] bg-gray-100 dark:bg-gray-700/60 rounded-lg mx-auto"></div>
          </div>
          <div className="h-3 w-24 bg-gray-100 dark:bg-gray-700/60 rounded mx-auto"></div>
        </div>
      </div>

      {/* 4. Visual Panels Grid - Row 2 (Bar & Line) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl h-80 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="h-4.5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-52 bg-gray-100 dark:bg-gray-700/60 rounded"></div>
          </div>
          <div className="flex items-end justify-between h-40 pt-4 px-2">
            <div className="w-[10%] h-[30%] bg-gray-200 dark:bg-gray-700 rounded-t"></div>
            <div className="w-[10%] h-[50%] bg-gray-300 dark:bg-gray-700/90 rounded-t"></div>
            <div className="w-[10%] h-[40%] bg-gray-200 dark:bg-gray-700 rounded-t"></div>
            <div className="w-[10%] h-[75%] bg-gray-300 dark:bg-gray-700/90 rounded-t"></div>
            <div className="w-[10%] h-[60%] bg-gray-200 dark:bg-gray-700 rounded-t"></div>
            <div className="w-[10%] h-[90%] bg-gray-300 dark:bg-gray-700/60 rounded-t"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl h-80 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="h-4.5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-52 bg-gray-100 dark:bg-gray-700/60 rounded"></div>
          </div>
          <div className="relative h-40 flex items-center justify-center">
            <div className="absolute inset-x-2 h-0.5 bg-gray-100 dark:bg-gray-700/60"></div>
            <div className="h-16 w-full border-t border-b border-dashed border-gray-200 dark:border-gray-700"></div>
          </div>
        </div>
      </div>

    </div>
  );
}
