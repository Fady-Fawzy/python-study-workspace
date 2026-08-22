import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light' | 'system';
  onThemeChange: (theme: 'dark' | 'light' | 'system') => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onThemeChange }) => {
  const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={16} strokeWidth={2} />;
      case 'dark':
        return <Moon size={16} strokeWidth={2} />;
      default:
        return <Monitor size={16} strokeWidth={2} />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Theme: Light';
      case 'dark':
        return 'Theme: Dark';
      default:
        return 'Theme: System';
    }
  };

  return (
    <button
      type="button"
      className="icon-action-btn"
      onClick={() => onThemeChange(nextTheme)}
      title={`${getLabel()} (Click to toggle)`}
      aria-label={getLabel()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface-raised)',
        color: 'var(--text-secondary)',
        transition: 'all var(--transition-fast)'
      }}
    >
      {getIcon()}
    </button>
  );
};
