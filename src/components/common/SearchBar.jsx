import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar Component
 * A controlled search input with debouncing and clear button functionality.
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Current search query value
 * @param {Function} props.onChange - Callback function when search value changes
 * @returns {React.JSX.Element} The rendered SearchBar component
 */
export default function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Handle clear button click
  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative flex-1 max-w-md">
      <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
      <input
        type="text"
        placeholder="Search by name, company, or email..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        aria-label="Search leads"
        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
