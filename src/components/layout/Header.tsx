import React from 'react';
import { Menu, Search, Shield, BookOpen, Bookmark, FileText, Code2 } from 'lucide-react';
import { ThemeToggle } from '../shared/ThemeToggle';
import { StudyStateV1 } from '../../types/state';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenMobileDrawer: () => void;
  onOpenBackup: () => void;
  state: StudyStateV1;
  onThemeChange: (theme: 'dark' | 'light' | 'system') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
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
    { label: 'Notes', path: '/notes', icon: FileText, badge: Object.keys(state.lessonNotes).filter(k => state.lessonNotes[k].trim()).length }
  ];

  const isLinkActive = (path: string) => {
    if (path === '/') return currentPath === '/' || currentPath.startsWith('/lesson');
    return currentPath.startsWith(path);
  };

  return (
    <header className="app-header">
      {/* Left section: Drawer Toggle + Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
        <button
          type="button"
          className="mobile-only-btn"
          onClick={onOpenMobileDrawer}
          aria-label="Open lessons navigation drawer"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-raised)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            flexShrink: 0
          }}
        >
          <Menu size={18} />
        </button>

        <div
          onClick={() => onNavigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            cursor: 'pointer',
            userSelect: 'none',
            minWidth: 0
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              flexShrink: 0
            }}
          >
            PY
          </span>
          <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Python <span className="brand-subtext" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>20→74</span>
          </span>
        </div>
      </div>

      {/* Middle section: Navigation links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }} className="desktop-nav-links">
        {navLinks.map(link => {
          const active = isLinkActive(link.path);
          const Icon = link.icon;
          return (
            <button
              key={link.path}
              type="button"
              onClick={() => onNavigate(link.path)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: active ? 600 : 500,
                color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: active ? 'var(--accent-primary-muted)' : 'transparent',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Icon size={14} />
              <span>{link.label}</span>
              {typeof link.badge === 'number' && link.badge > 0 && (
                <span
                  style={{
                    fontSize: '11px',
                    padding: '0 5px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: active ? 'var(--accent-primary)' : 'var(--bg-badge)',
                    color: active ? '#ffffff' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {link.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right section: Search, Progress, Backup, Theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        {/* Search button */}
        <button
          type="button"
          onClick={onOpenSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '6px 8px',
            backgroundColor: 'var(--bg-surface-raised)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            fontSize: 'var(--text-xs)',
            transition: 'border-color var(--transition-fast)'
          }}
          title="Global Search (Ctrl+K)"
        >
          <Search size={14} />
          <span className="search-text-desktop">Search...</span>
          <kbd
            className="search-kbd-desktop"
            style={{
              padding: '1px 5px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px'
            }}
          >
            Ctrl K
          </kbd>
        </button>

        {/* Progress badge (Desktop/Tablet only) */}
        <div
          title={`${completedCount} of 55 lessons completed (${percent}%)`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            padding: '4px 6px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-raised)',
            border: '1px solid var(--border-subtle)',
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            color: completedCount > 0 ? 'var(--accent-success)' : 'var(--text-muted)'
          }}
          className="header-progress-badge"
        >
          <span>{completedCount}/55</span>
        </div>

        {/* Backup button */}
        <button
          type="button"
          onClick={onOpenBackup}
          title="Backup & Restore Data"
          aria-label="Backup & Restore Data"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-raised)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)'
          }}
        >
          <Shield size={15} strokeWidth={1.8} />
        </button>

        {/* Theme toggle */}
        <ThemeToggle theme={state.theme} onThemeChange={onThemeChange} />
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .mobile-only-btn {
            display: inline-flex !important;
          }
          .desktop-nav-links {
            display: none !important;
          }
          .search-text-desktop, .search-kbd-desktop {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .header-progress-badge {
            display: none !important;
          }
        }
        @media (max-width: 420px) {
          .brand-subtext {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
