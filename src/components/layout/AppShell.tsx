import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Bookmark, Code2, FileText, Shield, Sun } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { MobileBottomNav } from './MobileBottomNav';
import { OfflineStatus } from './OfflineStatus';
import { SearchCommand, SearchModal } from '../search/SearchModal';
import { BackupModal } from '../backup/BackupModal';
import { Lesson, SyntaxSection } from '../../types/content';
import { StudyStateV1 } from '../../types/state';
import { IndexedItem } from '../../lib/searchIndex';
import { closeTransientOverlays } from '../../lib/overlayEvents';

interface AppShellProps {
  currentPath: string;
  lessons: Lesson[];
  syntaxSections: SyntaxSection[];
  searchIndex: IndexedItem[];
  state: StudyStateV1;
  activeLessonId: string | null;
  onNavigate: (path: string) => void;
  onUpdateState: (updater: (prev: StudyStateV1) => StudyStateV1) => void;
  onThemeChange: (theme: 'dark' | 'light' | 'system') => void;
  isFullView?: boolean;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPath,
  lessons,
  searchIndex,
  state,
  activeLessonId,
  onNavigate,
  onUpdateState,
  onThemeChange,
  isFullView = false,
  children
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const previousPathRef = useRef(currentPath);
  const closeMobileDrawer = useCallback(() => setIsMobileDrawerOpen(false), []);
  const openSearch = useCallback(() => {
    closeTransientOverlays();
    setIsBackupOpen(false);
    setIsMobileDrawerOpen(false);
    setIsSearchOpen(true);
  }, []);
  const openBackup = useCallback(() => {
    closeTransientOverlays();
    setIsSearchOpen(false);
    setIsMobileDrawerOpen(false);
    setIsBackupOpen(true);
  }, []);

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isSearchOpen) setIsSearchOpen(false);
        else openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, openSearch]);

  useEffect(() => {
    if (previousPathRef.current === currentPath) return;
    previousPathRef.current = currentPath;
    mainRef.current?.focus({ preventScroll: true });
  }, [currentPath]);

  const isFullWidthPage = currentPath.startsWith('/reference') || currentPath === '/bookmarks' || currentPath === '/notes';
  const nextTheme = state.theme === 'dark' ? 'light' : state.theme === 'light' ? 'dark' : 'light';
  const commands: SearchCommand[] = [
    {
      id: 'study-home',
      label: 'Study home',
      description: 'Return to your course dashboard.',
      keywords: ['home', 'dashboard', 'study'],
      icon: <BookOpen size={16} />,
      onSelect: () => onNavigate('/')
    },
    {
      id: 'syntax-reference',
      label: 'Syntax Reference',
      description: 'Browse the Python syntax notebook.',
      keywords: ['reference', 'syntax', 'docs'],
      icon: <Code2 size={16} />,
      onSelect: () => onNavigate('/reference')
    },
    {
      id: 'bookmarks',
      label: 'Bookmarks',
      description: 'Open lessons and syntax you saved.',
      keywords: ['saved', 'bookmark'],
      icon: <Bookmark size={16} />,
      onSelect: () => onNavigate('/bookmarks')
    },
    {
      id: 'notes',
      label: 'Notes',
      description: 'Review your personal lesson notes.',
      keywords: ['notes', 'writing'],
      icon: <FileText size={16} />,
      onSelect: () => onNavigate('/notes')
    },
    {
      id: 'backup-restore',
      label: 'Backup & Restore',
      description: 'Export or restore your local study data.',
      keywords: ['backup', 'restore', 'data'],
      icon: <Shield size={16} />,
      onSelect: openBackup
    },
    {
      id: `theme-${nextTheme}`,
      label: `Switch to ${nextTheme} theme`,
      description: 'Change the workspace appearance.',
      keywords: ['theme', 'dark', 'light', 'appearance'],
      icon: <Sun size={16} />,
      onSelect: () => onThemeChange(nextTheme)
    }
  ];

  return (
    <div
      className={`app-shell${isFullView ? ' app-shell--full-view' : ''}`}
      data-full-view={isFullView ? 'true' : undefined}
      data-testid="app-shell"
    >
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus({ preventScroll: true });
        }}
      >
        Skip to content
      </a>

      {/* Desktop Sidebar (visible on screens > 1024px) */}
      <Sidebar
        lessons={lessons}
        activeLessonId={activeLessonId}
        state={state}
        currentPath={currentPath}
        onNavigate={onNavigate}
        onSelectLesson={(id) => onNavigate(`/lesson/${id}`)}
      />

      {/* Mobile Slide-over Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={closeMobileDrawer}
        lessons={lessons}
        activeLessonId={activeLessonId}
        state={state}
        currentPath={currentPath}
        onNavigate={onNavigate}
        onOpenBackup={openBackup}
        triggerRef={mobileMenuButtonRef}
      />

      {/* Main Column */}
      <div className="app-main-wrapper">
        <Header
          currentPath={currentPath}
          isMobileDrawerOpen={isMobileDrawerOpen}
          mobileMenuButtonRef={mobileMenuButtonRef}
          onNavigate={onNavigate}
          onOpenSearch={openSearch}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
          onOpenBackup={openBackup}
          state={state}
          onThemeChange={onThemeChange}
        />
        <OfflineStatus />

        <main
          ref={mainRef}
          id="main-content"
          tabIndex={-1}
          className={`app-content ${isFullWidthPage ? 'full-width' : ''}`}
        >
          {children}
        </main>
      </div>

      <MobileBottomNav
        currentPath={currentPath}
        isLessonsOpen={isMobileDrawerOpen}
        onNavigate={onNavigate}
        onOpenLessons={() => setIsMobileDrawerOpen(true)}
        onOpenSearch={openSearch}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        index={searchIndex}
        onSelectResult={(url) => onNavigate(url)}
        commands={commands}
      />

      {/* Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        state={state}
        onStateRestored={(newState) => onUpdateState(() => newState)}
      />
    </div>
  );
};
