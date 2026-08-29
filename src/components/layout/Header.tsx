import React from 'react';
import { Menu, Search, Shield } from 'lucide-react';
import { ThemeToggle } from '../shared/ThemeToggle';
import { StudyStateV1 } from '../../types/state';

interface HeaderProps {
  currentPath: string;
  isMobileDrawerOpen: boolean;
  mobileMenuButtonRef: React.RefObject<HTMLButtonElement | null>;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenMobileDrawer: () => void;
  onOpenBackup: () => void;
  state: StudyStateV1;
  onThemeChange: (theme: 'dark' | 'light' | 'system') => void;
}

const pageContext = (currentPath: string) => {
  if (currentPath.startsWith('/lesson/')) return 'Lesson workspace';
  if (currentPath.startsWith('/reference')) return 'Syntax reference';
  if (currentPath.startsWith('/bookmarks')) return 'Bookmarks';
  if (currentPath.startsWith('/notes')) return 'Notes';
  return 'Study dashboard';
};

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  isMobileDrawerOpen,
  mobileMenuButtonRef,
  onNavigate,
  onOpenSearch,
  onOpenMobileDrawer,
  onOpenBackup,
  state,
  onThemeChange
}) => {
  const completedCount = state.completedLessons.length;
  const percent = Math.round((completedCount / 55) * 100);
  return (
    <header className="app-header">
      <div className="app-header__identity">
        <button
          ref={mobileMenuButtonRef}
          type="button"
          className="ui-icon-button app-header__menu"
          onClick={onOpenMobileDrawer}
          aria-label="Open lessons navigation"
          aria-controls="mobile-navigation-drawer"
          aria-expanded={isMobileDrawerOpen}
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          className="app-brand"
          onClick={() => onNavigate('/')}
          aria-label="Python study home"
        >
          <span className="app-brand__mark" aria-hidden="true">py/</span>
          <span className="app-brand__label">
            Python Study <span className="app-brand__range">20—74</span>
          </span>
        </button>
        <span className="app-header__context">{pageContext(currentPath)}</span>
      </div>

      <div className="app-header__actions">
        <button
          type="button"
          className="header-search-button"
          onClick={onOpenSearch}
          title="Global Search (Ctrl+K)"
          aria-label="Global search (Ctrl+K)"
          aria-keyshortcuts="Control+K Meta+K"
        >
          <Search size={18} aria-hidden="true" />
          <span className="header-search-button__label">Search</span>
          <kbd className="header-search-button__shortcut">Ctrl K</kbd>
        </button>

        <div
          className="header-progress-badge"
          title={`${completedCount} of 55 lessons completed (${percent}%)`}
          aria-label={`${completedCount} of 55 lessons completed`}
        >
          {completedCount}/55
        </div>

        <button
          type="button"
          className="ui-icon-button header-backup-button"
          onClick={onOpenBackup}
          title="Backup & Restore Data"
          aria-label="Backup & Restore Data"
        >
          <Shield size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>

        <ThemeToggle theme={state.theme} onThemeChange={onThemeChange} />
      </div>
    </header>
  );
};
