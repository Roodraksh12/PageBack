import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const darkMode = false; // Locked to light mode

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const toggleDark = () => {}; // No-op

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
