import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // isDarkMode state from localStorage (default: false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('startup-crm-theme');
      return stored === 'true'; // default: false
    }
    return false;
  });

  // Synchronize on state change (e.g. key updates)
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // toggleTheme function that:
  // - Flips isDarkMode boolean
  // - Adds or removes 'dark' class on document.documentElement
  // - Saves preference to localStorage
  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const nextMode = !prev;
      const root = window.document.documentElement;
      if (nextMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('startup-crm-theme', String(nextMode));
      }
      return nextMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isDark: isDarkMode, theme: isDarkMode ? 'dark' : 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
