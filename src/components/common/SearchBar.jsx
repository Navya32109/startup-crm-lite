import { useState, useEffect } from 'react';
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
  const [prevValue, setPrevValue] = useState(value);
  const [localValue, setLocalValue] = useState(value);

  // Sync local value with prop value during rendering to avoid effect warnings
  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  // Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  // Handle clear button click
  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative flex-1 max-w-md">
      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      <input
        type="text"
        placeholder="Search by name, company, or email..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        aria-label="Search leads"
        className="w-full pl-9 pr-10 py-3 md:py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-205 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500/80 text-gray-800 dark:text-gray-100 placeholder-gray-400 transition-all text-xs"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-205 transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
