import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light' | 'system';
  onThemeChange: (theme: 'dark' | 'light' | 'system') => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onThemeChange }) => {
  const prefersDark = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effectiveTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
  const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
  const label = effectiveTheme === 'dark' ? 'Theme: Dark' : 'Theme: Light';
  const title = theme === 'system'
    ? `${label} (System theme; click to toggle)`
    : `${label} (Click to toggle)`;
  const icon = effectiveTheme === 'dark'
    ? <Moon size={18} strokeWidth={2} />
    : <Sun size={18} strokeWidth={2} />;

  return (
    <button
      type="button"
      className="ui-icon-button theme-toggle"
      onClick={() => onThemeChange(nextTheme)}
      title={title}
      aria-label={label}
    >
      {icon}
    </button>
  );
};
