import React from 'react';
import { Menu, Search, Shield, BookOpen, Bookmark, FileText, Code2 } from 'lucide-react';
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

const isLinkActive = (currentPath: string, path: string) => {
  if (path === '/') return currentPath === '/' || currentPath.startsWith('/lesson');
  return currentPath.startsWith(path);
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
  const navLinks = [
    { label: 'Study', path: '/', icon: BookOpen },
    { label: 'Syntax Ref', path: '/reference', icon: Code2 },
    { label: 'Bookmarks', path: '/bookmarks', icon: Bookmark, badge: state.bookmarkedLessons.length + state.bookmarkedSyntax.length },
    { label: 'Notes', path: '/notes', icon: FileText, badge: Object.values(state.lessonNotes).filter(note => note.trim()).length }
  ];

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
          <span className="app-brand__mark" aria-hidden="true">PY</span>
          <span className="app-brand__label">
            Python <span className="app-brand__range">20→74</span>
          </span>
        </button>
      </div>

      <nav className="desktop-nav-links" aria-label="Primary navigation">
        {navLinks.map(link => {
          const active = isLinkActive(currentPath, link.path);
          const Icon = link.icon;
          return (
            <button
              key={link.path}
              type="button"
              className="header-nav-link"
              data-active={active || undefined}
              aria-current={active ? 'page' : undefined}
              aria-label={link.label}
              onClick={() => onNavigate(link.path)}
            >
              <Icon size={15} aria-hidden="true" />
              <span>{link.label}</span>
              {typeof link.badge === 'number' && link.badge > 0 && (
                <span className="navigation-count">{link.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="app-header__actions">
        <button
          type="button"
          className="header-search-button"
          onClick={onOpenSearch}
          title="Global Search (Ctrl+K)"
          aria-label="Global search (Ctrl+K)"
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
