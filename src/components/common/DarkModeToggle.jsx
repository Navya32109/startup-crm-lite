import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div 
      onClick={toggleTheme}
      className="flex items-center justify-between gap-3 px-3.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl h-11 shrink-0 select-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      }}
    >
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {isDarkMode ? (
          <>
            <Moon size={15} className="text-blue-500 shrink-0" />
            <span>Dark Mode</span>
          </>
        ) : (
          <>
            <Sun size={15} className="text-amber-500 shrink-0" />
            <span>Light Mode</span>
          </>
        )}
      </span>
      <div
        className="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-gray-200 dark:bg-gray-700"
        role="switch"
        aria-checked={isDarkMode}
        aria-label="Toggle dark mode"
      >
        <span
          className={`${
            isDarkMode ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out`}
        />
      </div>
    </div>
  );
}
