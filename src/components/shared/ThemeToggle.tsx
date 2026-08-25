import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light' | 'system';
  onThemeChange: (theme: 'dark' | 'light' | 'system') => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onThemeChange }) => {
  const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
  const label = theme === 'dark' ? 'Theme: Dark' : theme === 'light' ? 'Theme: Light' : 'Theme: System';
  const icon = theme === 'dark'
    ? <Moon size={18} strokeWidth={2} />
    : theme === 'light'
      ? <Sun size={18} strokeWidth={2} />
      : <Monitor size={18} strokeWidth={2} />;

  return (
    <button
      type="button"
      className="ui-icon-button theme-toggle"
      onClick={() => onThemeChange(nextTheme)}
      title={`${label} (Click to toggle)`}
      aria-label={label}
    >
      {icon}
    </button>
  );
};
